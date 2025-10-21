namespace Cps.CaseManagement.MdsClient.Factories;

using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.MdsClient.Models.Entities;

public interface IMdsArgFactory
{
    MdsBaseArgDto CreateBaseArg(string cmsAuthValues, Guid correlationId);
    MdsUnitIdArg CreateGetByUnitIdArg(string cmsAuthValues, Guid correlationId, long unitId);
    MdsUrnArg CreateGetByUrnArg(string cmsAuthValues, Guid correlationId, string urn);
    MdsRegisterCaseArg CreateRegisterCaseArg(string cmsAuthValues, Guid correlationId, CaseRegistrationRequest caseDetails);
}