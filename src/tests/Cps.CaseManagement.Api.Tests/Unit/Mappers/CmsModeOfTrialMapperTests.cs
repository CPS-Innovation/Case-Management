namespace Cps.CaseManagement.Api.Tests.Unit.Mappers;

using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Mappers;

public class CmsModeOfTrialMapperTests
{
    [Theory]
    [InlineData("S", CmsModeOfTrialShortCodes.SUM)]
    [InlineData("I", CmsModeOfTrialShortCodes.IND)]
    [InlineData("E", CmsModeOfTrialShortCodes.EW)]
    [InlineData("N", CmsModeOfTrialShortCodes.NYC)]
    public void ToCmsValue_ReturnsExpectedShortCode_ForKnownId(string mdsId, string expectedShortCode)
    {
        var result = CmsModeOfTrialMapper.ToCmsValue(mdsId);

        Assert.Equal(expectedShortCode, result);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("X")]
    [InlineData("unknown")]
    public void ToCmsValue_ReturnsNull_ForUnknownOrNullId(string? mdsId)
    {
        var result = CmsModeOfTrialMapper.ToCmsValue(mdsId);

        Assert.Null(result);
    }
}
