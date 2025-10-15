using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using AutoFixture;
using Cps.CaseManagement.Api.Functions;
using Cps.CaseManagement.Api.Tests.Helpers;
using Cps.CaseManagement.MdsClient.Client;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Entities;
using Cps.CaseManagement.MdsClient.Models.Enums;
using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.MdsClient.Models.Constants;

namespace Cps.CaseManagement.Api.Tests.Functions
{
    public class ListAvailableOffencesTests
    {
        private readonly Mock<ILogger<ListAvailableOffences>> _loggerMock;
        private readonly Mock<IMdsClient> _mdsClientMock;
        private readonly Mock<IMdsArgFactory> _mdsArgFactoryMock;
        private readonly IFixture _fixture;
        private readonly ListAvailableOffences _function;
        private readonly Guid _testCorrelationId;
        private readonly string _testCmsAuthValues;
        private readonly string _username;

        public ListAvailableOffencesTests()
        {
            _loggerMock = new Mock<ILogger<ListAvailableOffences>>();
            _mdsClientMock = new Mock<IMdsClient>();
            _mdsArgFactoryMock = new Mock<IMdsArgFactory>();
            _fixture = new Fixture();

            _fixture.Customize<DateOnly>(c => c.FromFactory(() => new DateOnly(2024, 1, 1)));
            _fixture.Customize<DateOnly?>(c => c.FromFactory(() => new DateOnly(2024, 1, 1)));

            _testCorrelationId = _fixture.Create<Guid>();
            _testCmsAuthValues = _fixture.Create<string>();
            _username = _fixture.Create<string>();

            _function = new ListAvailableOffences(
                _loggerMock.Object,
                _mdsClientMock.Object,
                _mdsArgFactoryMock.Object);
        }

        [Fact]
        public async Task Run_ShouldReturnOkObjectResult_WhenValidRequest()
        {
            // Arrange
            var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(_testCorrelationId, _testCmsAuthValues, _username);

            var code = _fixture.Create<string>();
            var legislation = _fixture.Create<string>();
            var legislationPartialSearch = _fixture.Create<bool>();
            var description = _fixture.Create<string>();
            var descriptionPartialSearch = _fixture.Create<bool>();
            var keywords = new[] { _fixture.Create<string>(), _fixture.Create<string>() };
            var fromDate = _fixture.Create<DateOnly>();
            var toDate = _fixture.Create<DateOnly>();
            var page = _fixture.Create<int>();
            var itemsPerPage = _fixture.Create<int>();
            var orderBy = OffenceSearchResultOrder.Code;
            var isAscendingOrder = _fixture.Create<bool>();
            var multisearch = _fixture.Create<string>();
            var multisearchPartialSearch = _fixture.Create<bool>();

            var queryParams = new Dictionary<string, string>
            {
                { OffenceSearchQueryParameters.Code, code },
                { OffenceSearchQueryParameters.Legislation, legislation },
                { OffenceSearchQueryParameters.LegislationPartialSearch, legislationPartialSearch.ToString().ToLower() },
                { OffenceSearchQueryParameters.Description, description },
                { OffenceSearchQueryParameters.DescriptionPartialSearch, descriptionPartialSearch.ToString().ToLower() },
                { OffenceSearchQueryParameters.Keywords, string.Join(",", keywords) },
                { OffenceSearchQueryParameters.FromDate, fromDate.ToString("yyyy-MM-dd") },
                { OffenceSearchQueryParameters.ToDate, toDate.ToString("yyyy-MM-dd") },
                { OffenceSearchQueryParameters.Page, page.ToString() },
                { OffenceSearchQueryParameters.ItemsPerPage, itemsPerPage.ToString() },
                { OffenceSearchQueryParameters.OrderBy, orderBy.ToString() },
                { OffenceSearchQueryParameters.IsAscendingOrder, isAscendingOrder.ToString().ToLower() },
                { OffenceSearchQueryParameters.Multisearch, multisearch },
                { OffenceSearchQueryParameters.MultisearchPartialSearch, multisearchPartialSearch.ToString().ToLower() }
            };

            var request = HttpRequestStubHelper.CreateHttpRequestWithQueryParameters(queryParams, _testCorrelationId);

            var expectedArg = _fixture.Create<MdsOffenceSearchArg>();
            var expectedResult = _fixture.Create<OffencesEntity>();

            _mdsArgFactoryMock
                .Setup(f => f.CreateOffenceSearchArg(
                    _testCmsAuthValues,
                    _testCorrelationId,
                    code,
                    legislation,
                    legislationPartialSearch,
                    description,
                    descriptionPartialSearch,
                    It.Is<string[]>(k => k.Length == keywords.Length && k[0] == keywords[0] && k[1] == keywords[1]),
                    fromDate,
                    toDate,
                    page,
                    itemsPerPage,
                    orderBy,
                    isAscendingOrder,
                    multisearch,
                    multisearchPartialSearch))
                .Returns(expectedArg);

            _mdsClientMock
                .Setup(c => c.SearchOffences(expectedArg))
                .ReturnsAsync(expectedResult);

            // Act
            var result = await _function.Run(request, functionContext);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedResult, okResult.Value);

            _mdsArgFactoryMock.Verify(f => f.CreateOffenceSearchArg(
                _testCmsAuthValues,
                _testCorrelationId,
                code,
                legislation,
                legislationPartialSearch,
                description,
                descriptionPartialSearch,
                It.Is<string[]>(k => k.Length == keywords.Length && k[0] == keywords[0] && k[1] == keywords[1]),
                fromDate,
                toDate,
                page,
                itemsPerPage,
                orderBy,
                isAscendingOrder,
                multisearch,
                multisearchPartialSearch), Times.Once);

            _mdsClientMock.Verify(c => c.SearchOffences(expectedArg), Times.Once);
        }

        [Fact]
        public async Task Run_ShouldReturnOkResult_WhenOptionalParamsMissing()
        {
            // Arrange
            var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(_testCorrelationId, _testCmsAuthValues, _username);

            var queryParams = new Dictionary<string, string>
            {
                { OffenceSearchQueryParameters.LegislationPartialSearch, "false" },
                { OffenceSearchQueryParameters.DescriptionPartialSearch, "false" },
                { OffenceSearchQueryParameters.MultisearchPartialSearch, "false" }
            };

            var request = HttpRequestStubHelper.CreateHttpRequestWithQueryParameters(queryParams, _testCorrelationId);

            var expectedArg = _fixture.Create<MdsOffenceSearchArg>();
            var expectedResult = _fixture.Create<OffencesEntity>();

            _mdsArgFactoryMock
                .Setup(f => f.CreateOffenceSearchArg(
                    _testCmsAuthValues,
                    _testCorrelationId,
                    null,
                    null,
                    false,
                    null,
                    false,
                    It.IsAny<string[]>(),
                    null,
                    null,
                    null,
                    null,
                    null,
                    false,
                    null,
                    false))
                .Returns(expectedArg);

            _mdsClientMock
                .Setup(c => c.SearchOffences(expectedArg))
                .ReturnsAsync(expectedResult);

            // Act
            var result = await _function.Run(request, functionContext);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedResult, okResult.Value);

            _mdsClientMock.Verify(c => c.SearchOffences(expectedArg), Times.Once);
        }
    }
}
