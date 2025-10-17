namespace Cps.CaseManagement.MdsClient.Factories;

using Cps.CaseManagement.MdsClient.Models.Args;

public interface IMdsRequestFactory
{
    HttpRequestMessage CreateGetTitlesRequest(MdsBaseArgDto arg);
    HttpRequestMessage CreateGetReligionsRequest(MdsBaseArgDto arg);
    HttpRequestMessage CreateGetGendersRequest(MdsBaseArgDto arg);
    HttpRequestMessage CreateGetEthnicitesRequest(MdsBaseArgDto arg);
    HttpRequestMessage CreateGetMonitoringCodesRequest(MdsBaseArgDto arg);
    HttpRequestMessage CreateGetComplexitiesRequest(MdsBaseArgDto arg);
    HttpRequestMessage CreateGetOffenderCategoriesRequest(MdsBaseArgDto arg);
    HttpRequestMessage CreateGetProsecutorsRequest(MdsUnitIdArg arg);
    HttpRequestMessage CreateGetCaseworkersRequest(MdsUnitIdArg arg);
    HttpRequestMessage CreateGetCourtsRequest(MdsUnitIdArg arg);
    HttpRequestMessage CreateGetUnitsRequest(MdsBaseArgDto arg);
    HttpRequestMessage CreateGetWMSUnitsRequest(MdsBaseArgDto arg);
    HttpRequestMessage CreateListCasesByUrnRequest(MdsUrnArg arg);
    HttpRequestMessage CreateUserDataRequest(MdsBaseArgDto arg);
    HttpRequestMessage CreateGetCmsModernTokenRequest(MdsBaseArgDto arg);
    HttpRequestMessage CreateSearchOffencesRequest(MdsOffenceSearchArg arg);
}
