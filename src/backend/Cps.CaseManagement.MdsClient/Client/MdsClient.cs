namespace Cps.CaseManagement.MdsClient.Client;

using System.Net;
using System.Text.Json;
using Cps.CaseManagement.MdsClient.Exceptions;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.MdsClient.Models.Entities;
using CPS.CaseManagement.MdsClient.Models.Dto;

public class MdsClient(HttpClient httpClient,
    IMdsRequestFactory mdsRequestFactory) : IMdsClient
{
    private readonly HttpClient _httpClient = httpClient;
    private readonly IMdsRequestFactory _mdsRequestFactory = mdsRequestFactory;

    public async Task<IEnumerable<TitleEntity>> GetTitlesAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetTitlesRequest(arg);
        return await CallMds<IEnumerable<TitleEntity>>(request);
    }

    public async Task<IEnumerable<ReligionEntity>> GetReligionsAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetReligionsRequest(arg);
        return await CallMds<IEnumerable<ReligionEntity>>(request);
    }

    public async Task<IEnumerable<GenderEntity>> GetGendersAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetGendersRequest(arg);
        return await CallMds<IEnumerable<GenderEntity>>(request);
    }

    public async Task<IEnumerable<EthnicityEntity>> GetEthnicitiesAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetEthnicitesRequest(arg);
        return await CallMds<IEnumerable<EthnicityEntity>>(request);
    }

    public async Task<IEnumerable<MonitoringCodeEntity>> GetMonitoringCodesAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetMonitoringCodesRequest(arg);
        return await CallMds<IEnumerable<MonitoringCodeEntity>>(request);
    }

    public async Task<IEnumerable<ComplexitityEntity>> GetComplexityCodesAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetComplexitiesRequest(arg);
        return await CallMds<IEnumerable<ComplexitityEntity>>(request);
    }

    public async Task<IEnumerable<OffenderCategoryEntity>> GetOffenderCategoriesAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetOffenderCategoriesRequest(arg);
        return await CallMds<IEnumerable<OffenderCategoryEntity>>(request);
    }

    public async Task<IEnumerable<ProsecutorOrCaseworkerEntity>> GetProsecutorsAsync(MdsUnitIdArg arg)
    {
        var request = _mdsRequestFactory.CreateGetProsecutorsRequest(arg);
        return await CallMds<IEnumerable<ProsecutorOrCaseworkerEntity>>(request);
    }

    public async Task<IEnumerable<ProsecutorOrCaseworkerEntity>> GetCaseworkersAsync(MdsUnitIdArg arg)
    {
        var request = _mdsRequestFactory.CreateGetCaseworkersRequest(arg);
        return await CallMds<IEnumerable<ProsecutorOrCaseworkerEntity>>(request);
    }

    public async Task<IEnumerable<CourtEntity>> GetCourtsAsync(MdsUnitIdArg arg)
    {
        var request = _mdsRequestFactory.CreateGetCourtsRequest(arg);
        return await CallMds<IEnumerable<CourtEntity>>(request);
    }

    public async Task<UnitsDto> GetUnitsAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetUnitsRequest(arg);
        var unitRequest = _mdsRequestFactory.CreateGetUnitsRequest(arg);
        var allUnitsTask = CallMds<IEnumerable<UnitEntity>>(unitRequest);

        var userDataRequest = _mdsRequestFactory.CreateUserDataRequest(arg);
        var userDataTask = CallMds<UserDataEntity>(userDataRequest);

        await Task.WhenAll(allUnitsTask, userDataTask);

        var allUnits = await allUnitsTask;
        var userData = await userDataTask;

        return new UnitsDto
        {
            AllUnits = allUnits.ToList(),
            HomeUnit = allUnits.FirstOrDefault(u => u.Id == userData.HomeUnit.UnitId)
        };
    }

    public async Task<IEnumerable<WMSUnitEntity>> GetWMSUnitsAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetWMSUnitsRequest(arg);
        return await CallMds<IEnumerable<WMSUnitEntity>>(request);
    }

    public async Task<IEnumerable<CaseInfoEntity>> ListCasesByUrnAsync(MdsUrnArg arg)
    {
        var request = _mdsRequestFactory.CreateListCasesByUrnRequest(arg);
        return await CallMds<IEnumerable<CaseInfoEntity>>(request);
    }

    private async Task<T> CallMds<T>(HttpRequestMessage request)
    {
        using var response = await CallMds(request);
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<T>(content) ?? throw new InvalidOperationException("Deserialization returned null.");
        return result;
    }

    private async Task<HttpResponseMessage> CallMds(HttpRequestMessage request, params HttpStatusCode[] expectedUnhappyStatusCodes)
    {
        var response = await _httpClient.SendAsync(request);
        try
        {
            if (response.IsSuccessStatusCode || expectedUnhappyStatusCodes.Contains(response.StatusCode))
            {
                return response;
            }

            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                throw new CmsUnauthorizedException();
            }

            var content = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException(content);
        }
        catch (HttpRequestException exception)
        {
            throw new MdsClientException(response.StatusCode, exception);
        }
    }
}