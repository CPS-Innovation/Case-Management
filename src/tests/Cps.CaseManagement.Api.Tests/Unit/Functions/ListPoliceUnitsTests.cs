namespace Cps.CaseManagement.Api.Tests.Unit.Functions;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using AutoFixture;
using Cps.CaseManagement.Api.Functions;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.Api.Tests.Helpers;
using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.Api.Services;
using Cps.CaseManagement.Api.Models.Dto;

public class ListPoliceUnitsTests
{
    private readonly Mock<ILogger<ListPoliceUnits>> _loggerMock;
    private readonly Mock<IMdsService> _mdsServiceMock;
    private readonly Mock<IMdsArgFactory> _mdsArgFactoryMock;
    private readonly Fixture _fixture;
    private readonly ListPoliceUnits _function;

    public ListPoliceUnitsTests()
    {
        _loggerMock = new Mock<ILogger<ListPoliceUnits>>();
        _mdsServiceMock = new Mock<IMdsService>();
        _mdsArgFactoryMock = new Mock<IMdsArgFactory>();
        _fixture = new Fixture();
        _function = new ListPoliceUnits(_loggerMock.Object, _mdsServiceMock.Object, _mdsArgFactoryMock.Object);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithExpectedPoliceUnits()
    {
        // Arrange
        var expectedUnits = _fixture.Create<PoliceUnitDto[]>();
        var correlationId = _fixture.Create<Guid>();
        var cmsAuthValues = _fixture.Create<string>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateBaseArg(cmsAuthValues, It.IsAny<Guid>()))
            .Returns(baseArg);

        _mdsServiceMock
            .Setup(c => c.GetPoliceUnitsAsync(baseArg))
            .ReturnsAsync(expectedUnits);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(correlationId, cmsAuthValues, _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequest(correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedUnits, okResult.Value);

        _mdsArgFactoryMock.Verify(f => f.CreateBaseArg(cmsAuthValues, correlationId), Times.Once);
        _mdsServiceMock.Verify(c => c.GetPoliceUnitsAsync(baseArg), Times.Once);
        _mdsServiceMock.VerifyNoOtherCalls();
        _mdsArgFactoryMock.VerifyNoOtherCalls();
    }
}
