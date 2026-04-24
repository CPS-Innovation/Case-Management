using Cps.CaseManagement.Api.Constants;

namespace Cps.CaseManagement.Api.Mappers;

public static class CmsModeOfTrialMapper
{
    public static string? ToCmsValue(string? cmsModeOfTrialId)
    {
        return cmsModeOfTrialId switch
        {
            "S" => CmsModeOfTrialShortCodes.SUM,
            "I" => CmsModeOfTrialShortCodes.IND,
            "E" => CmsModeOfTrialShortCodes.EW,
            "N" => CmsModeOfTrialShortCodes.NYC,
            _ => null // If the value from MDS doesn't match any known short code, return null to avoid mapping to an incorrect value and the list not returning at all.
        };
    }
}