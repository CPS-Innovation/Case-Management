namespace Cps.CaseManagement.Api.Tests.Unit.Functions;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using AutoFixture;
using Cps.CaseManagement.Api.Functions;
using Cps.CaseManagement.MdsClient.Client;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.Api.Tests.Helpers;
using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.MdsClient.Models.Entities;

public class ListWMSUnitsTests
{
    private readonly Mock<ILogger<ListWMSUnits>> _loggerMock;
    private readonly Mock<IMdsClient> _mdsClientMock;
    private readonly Mock<IMdsArgFactory> _mdsArgFactoryMock;
    private readonly Fixture _fixture;
    private readonly ListWMSUnits _function;

    public ListWMSUnitsTests()
    {
        _loggerMock = new Mock<ILogger<ListWMSUnits>>();
        _mdsClientMock = new Mock<IMdsClient>();
        _mdsArgFactoryMock = new Mock<IMdsArgFactory>();
        _fixture = new Fixture();
        _function = new ListWMSUnits(_loggerMock.Object, _mdsClientMock.Object, _mdsArgFactoryMock.Object);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithExpectedWMSUnits()
    {
        // Arrange
        var expectedUnits = _fixture.Create<WMSUnitEntity[]>();
        var correlationId = _fixture.Create<Guid>();
        var cmsAuthValues = _fixture.Create<string>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateBaseArg(It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns(baseArg);

        _mdsClientMock
            .Setup(c => c.GetWMSUnitsAsync(baseArg))
            .ReturnsAsync(expectedUnits);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequest(correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedUnits, okResult.Value);
        _mdsClientMock.Verify(c => c.GetWMSUnitsAsync(baseArg), Times.Once);
    }
}
