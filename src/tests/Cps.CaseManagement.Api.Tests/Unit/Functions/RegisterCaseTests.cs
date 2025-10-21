using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using AutoFixture;
using Cps.CaseManagement.Api.Context;
using Cps.CaseManagement.Api.Functions;
using Cps.CaseManagement.Api.Helpers;
using Cps.CaseManagement.Api.Tests.Helpers;
using Cps.CaseManagement.Api.Validators;
using Cps.CaseManagement.Domain.Models;
using Cps.CaseManagement.MdsClient.Client;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.MdsClient.Models.Entities;
using CPS.CaseManagement.MdsClient.Models.Dto;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Cps.CaseManagement.Api.Tests.Unit.Functions;

public class RegisterCaseTest
{
    private readonly Mock<ILogger<RegisterCase>> _loggerMock;
    private readonly Mock<IMdsClient> _mdsClientMock;
    private readonly Mock<IMdsArgFactory> _mdsArgFactoryMock;
    private readonly Mock<IRequestValidator> _requestValidatorMock;
    private readonly Fixture _fixture;
    private readonly RegisterCase _function;

    public RegisterCaseTest()
    {
        _loggerMock = new Mock<ILogger<RegisterCase>>();
        _mdsClientMock = new Mock<IMdsClient>();
        _mdsArgFactoryMock = new Mock<IMdsArgFactory>();
        _requestValidatorMock = new Mock<IRequestValidator>();
        _fixture = new Fixture();
        _function = new RegisterCase(_loggerMock.Object, _mdsClientMock.Object, _mdsArgFactoryMock.Object, _requestValidatorMock.Object);
    }

    private static HttpRequest CreateHttpRequestFromJson(object obj, Guid correlationId)
    {
        var context = new DefaultHttpContext();
        var req = HttpRequestStubHelper.CreateHttpRequest(correlationId);
        req.ContentType = "application/json";
        if (obj != null)
        {
            var json = JsonSerializer.Serialize(obj);
            var bytes = Encoding.UTF8.GetBytes(json);
            req.Body = new MemoryStream(bytes);
            req.Body.Position = 0;
        }
        else
        {
            req.Body = new MemoryStream();
        }
        return req;
    }

    [Fact]
    public async Task Run_InvalidRequest_ReturnsBadRequest()
    {
        // Arrange
        var validationErrors = _fixture.CreateMany<string>(2).ToList();
        var caseDetails = _fixture.Create<CaseRegistrationRequest>();
        var correlationId = _fixture.Create<Guid>();

        _requestValidatorMock
            .Setup(x => x.GetJsonBody<CaseRegistrationRequest, CaseRegistrationRequestValidator>(It.IsAny<HttpRequest>()))
            .ReturnsAsync(new ValidatableRequest<CaseRegistrationRequest>
            {
                IsValid = false,
                ValidationErrors = validationErrors,
                Value = caseDetails
            });
        
        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = CreateHttpRequestFromJson(caseDetails, correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(validationErrors.Count, ((IEnumerable<string>)badRequest!.Value!).Count());
    }

    [Fact]
    public async Task Run_MdsException_ReturnsBadRequest()
    {
        // Arrange
        var validationErrors = _fixture.CreateMany<string>(2).ToList();
        var caseDetails = _fixture.Create<CaseRegistrationRequest>();
        var correlationId = _fixture.Create<Guid>();
        var cmsAuthValues = _fixture.Create<string>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _requestValidatorMock
            .Setup(x => x.GetJsonBody<CaseRegistrationRequest, CaseRegistrationRequestValidator>(It.IsAny<HttpRequest>()))
            .ReturnsAsync(new ValidatableRequest<CaseRegistrationRequest>
            {
                IsValid = true,
                Value = caseDetails
            });

        _mdsClientMock.Setup(x => x.RegisterCaseAsync(It.IsAny<MdsRegisterCaseArg>()))
            .ThrowsAsync(new Exception("Error"));

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = CreateHttpRequestFromJson(caseDetails, correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Run_WithValidRequest_ReturnsOkObjectResult()
    {
        // Arrange
        var validationErrors = _fixture.CreateMany<string>(2).ToList();
        var caseDetails = _fixture.Create<CaseRegistrationRequest>();
        var correlationId = _fixture.Create<Guid>();
        var cmsAuthValues = _fixture.Create<string>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _requestValidatorMock
            .Setup(x => x.GetJsonBody<CaseRegistrationRequest, CaseRegistrationRequestValidator>(It.IsAny<HttpRequest>()))
            .ReturnsAsync(new ValidatableRequest<CaseRegistrationRequest>
            {
                IsValid = true,
                Value = caseDetails
            });

        _mdsClientMock.Setup(x => x.RegisterCaseAsync(It.IsAny<MdsRegisterCaseArg>()))
            .ReturnsAsync(new CaseRegistrationResponseDto { CaseId = 12345 });

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = CreateHttpRequestFromJson(caseDetails, correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        Assert.IsType<OkObjectResult>(result);
    }
}
