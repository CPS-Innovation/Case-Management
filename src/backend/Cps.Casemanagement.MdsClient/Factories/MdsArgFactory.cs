namespace Cps.CaseManagement.MdsClient.Factories;

using Cps.CaseManagement.MdsClient.Models.Args;

public class MdsArgFactory : IMdsArgFactory
{
    public MdsBaseArgDto CreateBaseArg(string cmsAuthValues, Guid correlationId)
    {
        return new MdsBaseArgDto
        {
            CmsAuthValues = cmsAuthValues,
            CorrelationId = correlationId
        };
    }

    public MdsUnitIdArg CreateGetByUnitIdArg(string cmsAuthValues, Guid correlationId, long unitId)
    {
        return new MdsUnitIdArg
        {
            CmsAuthValues = cmsAuthValues,
            CorrelationId = correlationId,
            UnitId = unitId
        };
    }

}