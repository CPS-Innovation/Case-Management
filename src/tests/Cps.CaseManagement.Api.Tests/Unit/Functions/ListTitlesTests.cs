namespace Cps.CaseManagement.Api.Tests.Unit.Functions;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using AutoFixture;
using Cps.CaseManagement.Api.Functions;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.Api.Tests.Helpers;
using Cps.CaseManagement.Api.Services;
using Cps.CaseManagement.Api.Models.Dto;

public class ListTitlesTests
{
    private readonly Mock<ILogger<ListTitles>> _loggerMock;
    private readonly Mock<IMdsService> _mdsServiceMock;
    private readonly Mock<IMdsArgFactory> _mdsArgFactoryMock;
    private readonly Fixture _fixture;
    private readonly ListTitles _function;

    public ListTitlesTests()
    {
        _loggerMock = new Mock<ILogger<ListTitles>>();
        _mdsServiceMock = new Mock<IMdsService>();
        _mdsArgFactoryMock = new Mock<IMdsArgFactory>();
        _fixture = new Fixture();
        _function = new ListTitles(_loggerMock.Object, _mdsServiceMock.Object, _mdsArgFactoryMock.Object);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithExpectedTitles_WhenNoFilterProvided()
    {
        // Arrange
        var expectedTitles = _fixture.Create<TitleDto[]>();
        var correlationId = _fixture.Create<Guid>();
        var cmsAuthValues = _fixture.Create<string>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateBaseArg(It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns(baseArg);

        _mdsServiceMock
            .Setup(c => c.GetTitlesAsync(baseArg, null))
            .ReturnsAsync(expectedTitles);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(
            correlationId,
            _fixture.Create<string>(),
            _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequest(correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedTitles, okResult.Value);
        _mdsServiceMock.Verify(c => c.GetTitlesAsync(baseArg, null), Times.Once);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithPoliceTitlesOnly_WhenIsPoliceTitleIsTrue()
    {
        // Arrange
        var expectedTitles = _fixture.Create<TitleDto[]>();
        var correlationId = _fixture.Create<Guid>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateBaseArg(It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns(baseArg);

        _mdsServiceMock
            .Setup(c => c.GetTitlesAsync(baseArg, true))
            .ReturnsAsync(expectedTitles);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(
            correlationId,
            _fixture.Create<string>(),
            _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequestWithQueryParameters(
            new Dictionary<string, string> { { "isPoliceTitle", "true" } },
            correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedTitles, okResult.Value);
        _mdsServiceMock.Verify(c => c.GetTitlesAsync(baseArg, true), Times.Once);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithNonPoliceTitlesOnly_WhenIsPoliceTitleIsFalse()
    {
        // Arrange
        var expectedTitles = _fixture.Create<TitleDto[]>();
        var correlationId = _fixture.Create<Guid>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateBaseArg(It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns(baseArg);

        _mdsServiceMock
            .Setup(c => c.GetTitlesAsync(baseArg, false))
            .ReturnsAsync(expectedTitles);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(
            correlationId,
            _fixture.Create<string>(),
            _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequestWithQueryParameters(
            new Dictionary<string, string> { { "isPoliceTitle", "false" } },
            correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedTitles, okResult.Value);
        _mdsServiceMock.Verify(c => c.GetTitlesAsync(baseArg, false), Times.Once);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithAllTitles_WhenIsPoliceTitleIsInvalid()
    {
        // Arrange
        var expectedTitles = _fixture.Create<TitleDto[]>();
        var correlationId = _fixture.Create<Guid>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateBaseArg(It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns(baseArg);

        _mdsServiceMock
            .Setup(c => c.GetTitlesAsync(baseArg, null))
            .ReturnsAsync(expectedTitles);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(
            correlationId,
            _fixture.Create<string>(),
            _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequestWithQueryParameters(
            new Dictionary<string, string> { { "isPoliceTitle", "invalid" } },
            correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedTitles, okResult.Value);
        _mdsServiceMock.Verify(c => c.GetTitlesAsync(baseArg, null), Times.Once);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithAllTitles_WhenIsPoliceTitleIsEmpty()
    {
        // Arrange
        var expectedTitles = _fixture.Create<TitleDto[]>();
        var correlationId = _fixture.Create<Guid>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateBaseArg(It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns(baseArg);

        _mdsServiceMock
            .Setup(c => c.GetTitlesAsync(baseArg, null))
            .ReturnsAsync(expectedTitles);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(
            correlationId,
            _fixture.Create<string>(),
            _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequestWithQueryParameters(
            new Dictionary<string, string> { { "isPoliceTitle", "" } },
            correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedTitles, okResult.Value);
        _mdsServiceMock.Verify(c => c.GetTitlesAsync(baseArg, null), Times.Once);
    }
}