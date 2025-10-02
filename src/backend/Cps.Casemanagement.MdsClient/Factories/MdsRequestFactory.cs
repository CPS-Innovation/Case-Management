namespace Cps.CaseManagement.MdsClient.Factories;

using Cps.CaseManagement.MdsClient.Models.Args;

public class MdsRequestFactory : IMdsRequestFactory
{
    private const string CorrelationId = "Correlation-Id";
    private const string CmsAuthValues = "Cms-Auth-Values";

    public HttpRequestMessage CreateGetTitlesRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/titles", arg);

    public HttpRequestMessage CreateGetReligionsRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/religions", arg);

    public HttpRequestMessage CreateGetGendersRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/genders", arg);

    public HttpRequestMessage CreateGetEthnicitesRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/ethnicities", arg);

    public HttpRequestMessage CreateGetMonitoringCodesRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/monitoring-codes", arg);

    public HttpRequestMessage CreateGetComplexitiesRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/complexities", arg);

    public HttpRequestMessage CreateGetOffenderCategoriesRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/offender-categories", arg);

    public HttpRequestMessage CreateGetProsecutorsRequest(MdsUnitIdArg arg) =>
        BuildRequest(HttpMethod.Get, $"api/prosecutors/{arg.UnitId}", arg);

    public HttpRequestMessage CreateGetCaseworkersRequest(MdsUnitIdArg arg) =>
        BuildRequest(HttpMethod.Get, $"api/caseworkers/{arg.UnitId}", arg);

    public HttpRequestMessage CreateGetCourtsRequest(MdsUnitIdArg arg) =>
        BuildRequest(HttpMethod.Get, $"api/courts/{arg.UnitId}", arg);

    public HttpRequestMessage CreateGetUnitsRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/units", arg);

    public HttpRequestMessage CreateGetWMSUnitsRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/wms-units", arg);

    public HttpRequestMessage CreateListCasesByUrnRequest(MdsUrnArg arg) =>
        BuildRequest(HttpMethod.Get, $"api/urns/{arg.Urn}/case-identifiers", arg);

    public HttpRequestMessage CreateUserDataRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/user-data", arg);


    private HttpRequestMessage BuildRequest(HttpMethod method, string path, MdsBaseArgDto arg)
    {
        var request = new HttpRequestMessage(method, path);
        request.Headers.Add(CorrelationId, arg.CorrelationId.ToString());
        request.Headers.Add(CmsAuthValues, arg.CmsAuthValues);
        return request;
    }
}