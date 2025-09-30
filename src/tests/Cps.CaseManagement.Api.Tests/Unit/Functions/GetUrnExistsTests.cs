namespace Cps.CaseManagement.Api.Tests.Unit.Functions;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using AutoFixture;
using Cps.CaseManagement.Api.Functions;
using Cps.CaseManagement.MdsClient.Client;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.MdsClient.Models.Entities;
using Cps.CaseManagement.Api.Tests.Helpers;

public class GetUrnExistsTests
{
    private readonly Mock<ILogger<GetUrnExists>> _loggerMock;
    private readonly Mock<IMdsClient> _mdsClientMock;
    private readonly Mock<IMdsArgFactory> _mdsArgFactoryMock;
    private readonly Fixture _fixture;
    private readonly GetUrnExists _function;
    private readonly Guid _correlationId;
    private readonly string _cmsAuthValues;
    private readonly string _urn;
    private readonly MdsUrnArg _getByUrnArg;

    public GetUrnExistsTests()
    {
        _loggerMock = new Mock<ILogger<GetUrnExists>>();
        _mdsClientMock = new Mock<IMdsClient>();
        _mdsArgFactoryMock = new Mock<IMdsArgFactory>();
        _fixture = new Fixture();
        _function = new GetUrnExists(_loggerMock.Object, _mdsClientMock.Object, _mdsArgFactoryMock.Object);

        _correlationId = _fixture.Create<Guid>();
        _cmsAuthValues = _fixture.Create<string>();
        _urn = _fixture.Create<string>();
        _getByUrnArg = _fixture.Create<MdsUrnArg>();
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithTrue_WhenUrnExists()
    {
        // Arrange
        var cases = _fixture.Create<CaseInfoEntity[]>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateGetByUrnArg(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<string>()))
            .Returns(_getByUrnArg);

        _mdsClientMock
            .Setup(c => c.ListCasesByUrnAsync(_getByUrnArg))
            .ReturnsAsync(cases);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(_correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequest(_correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext, _urn);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
        Assert.True((bool)okResult.Value);
        _mdsClientMock.Verify(c => c.ListCasesByUrnAsync(_getByUrnArg), Times.Once);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithFalse_WhenUrnDoesNotExist()
    {
        // Arrange
        _mdsArgFactoryMock
            .Setup(f => f.CreateGetByUrnArg(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<string>()))
            .Returns(_getByUrnArg);

        _mdsClientMock
            .Setup(c => c.ListCasesByUrnAsync(_getByUrnArg))
            .ReturnsAsync(Array.Empty<CaseInfoEntity>());

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(_correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequest(_correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext, _urn);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
        Assert.False((bool)okResult.Value);
        _mdsClientMock.Verify(c => c.ListCasesByUrnAsync(_getByUrnArg), Times.Once);
    }
}