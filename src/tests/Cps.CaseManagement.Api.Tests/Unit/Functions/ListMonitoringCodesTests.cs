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

public class ListMonitoringCodesTests
{
    private readonly Mock<ILogger<ListMonitoringCodes>> _loggerMock;
    private readonly Mock<IMdsService> _mdsServiceMock;
    private readonly Mock<IMdsArgFactory> _mdsArgFactoryMock;
    private readonly Fixture _fixture;
    private readonly ListMonitoringCodes _function;

    public ListMonitoringCodesTests()
    {
        _loggerMock = new Mock<ILogger<ListMonitoringCodes>>();
        _mdsServiceMock = new Mock<IMdsService>();
        _mdsArgFactoryMock = new Mock<IMdsArgFactory>();
        _fixture = new Fixture();
        _function = new ListMonitoringCodes(_loggerMock.Object, _mdsServiceMock.Object, _mdsArgFactoryMock.Object);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithExpectedMonitoringCodes()
    {
        // Arrange
        var expectedMonitoringCodes = _fixture.Create<MonitoringCodeDto[]>();
        var correlationId = _fixture.Create<Guid>();
        var cmsAuthValues = _fixture.Create<string>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateBaseArg(It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns(baseArg);

        _mdsServiceMock
            .Setup(c => c.GetMonitoringCodesAsync(baseArg))
            .ReturnsAsync(expectedMonitoringCodes);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequest(correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedMonitoringCodes, okResult.Value);
        _mdsServiceMock.Verify(c => c.GetMonitoringCodesAsync(baseArg), Times.Once);
    }
}