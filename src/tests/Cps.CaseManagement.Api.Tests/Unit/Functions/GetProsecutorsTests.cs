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

public class GetProsecutorsTests
{
    private readonly Mock<ILogger<GetProsecutors>> _loggerMock;
    private readonly Mock<IMdsService> _mdsServiceMock;
    private readonly Mock<IMdsArgFactory> _mdsArgFactoryMock;
    private readonly Fixture _fixture;
    private readonly GetProsecutors _function;

    public GetProsecutorsTests()
    {
        _loggerMock = new Mock<ILogger<GetProsecutors>>();
        _mdsServiceMock = new Mock<IMdsService>();
        _mdsArgFactoryMock = new Mock<IMdsArgFactory>();
        _fixture = new Fixture();
        _function = new GetProsecutors(_loggerMock.Object, _mdsServiceMock.Object, _mdsArgFactoryMock.Object);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithExpectedProsecutors()
    {
        // Arrange
        var expectedProsecutors = _fixture.Create<ProsecutorOrCaseworkerDto[]>();
        var correlationId = _fixture.Create<Guid>();
        var cmsAuthValues = _fixture.Create<string>();
        var unitId = _fixture.Create<long>();
        var getByUnitIdArg = _fixture.Create<MdsUnitIdArg>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateGetByUnitIdArg(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<long>()))
            .Returns(getByUnitIdArg);

        _mdsServiceMock
            .Setup(c => c.GetProsecutorsAsync(getByUnitIdArg))
            .ReturnsAsync(expectedProsecutors);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequest(correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext, unitId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedProsecutors, okResult.Value);
        _mdsServiceMock.Verify(c => c.GetProsecutorsAsync(getByUnitIdArg), Times.Once);
    }
}
