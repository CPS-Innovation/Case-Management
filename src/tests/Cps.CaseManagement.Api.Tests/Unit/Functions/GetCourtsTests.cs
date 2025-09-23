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

public class GetCourtsTests
{
    private readonly Mock<ILogger<GetCourts>> _loggerMock;
    private readonly Mock<IMdsClient> _mdsClientMock;
    private readonly Mock<IMdsArgFactory> _mdsArgFactoryMock;
    private readonly Fixture _fixture;
    private readonly GetCourts _function;

    public GetCourtsTests()
    {
        _loggerMock = new Mock<ILogger<GetCourts>>();
        _mdsClientMock = new Mock<IMdsClient>();
        _mdsArgFactoryMock = new Mock<IMdsArgFactory>();
        _fixture = new Fixture();
        _function = new GetCourts(_loggerMock.Object, _mdsClientMock.Object, _mdsArgFactoryMock.Object);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithExpectedCourts()
    {
        // Arrange
        var expectedCourts = _fixture.Create<CourtEntity[]>();
        var correlationId = _fixture.Create<Guid>();
        var cmsAuthValues = _fixture.Create<string>();
        var unitId = _fixture.Create<long>();
        var getByUnitIdArg = _fixture.Create<MdsUnitIdArg>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateGetByUnitIdArg(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<long>()))
            .Returns(getByUnitIdArg);

        _mdsClientMock
            .Setup(c => c.GetCourtsAsync(getByUnitIdArg))
            .ReturnsAsync(expectedCourts);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequest(correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext, unitId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedCourts, okResult.Value);
        _mdsClientMock.Verify(c => c.GetCourtsAsync(getByUnitIdArg), Times.Once);
    }
}
