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

    public MdsUrnArg CreateGetByUrnArg(string cmsAuthValues, Guid correlationId, string urn)
    {
        return new MdsUrnArg
        {
            CmsAuthValues = cmsAuthValues,
            CorrelationId = correlationId,
            Urn = urn
        };
    }
}