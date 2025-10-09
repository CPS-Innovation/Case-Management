using System.Net;
using System.Text.Json;
using AutoFixture;
using AutoFixture.AutoMoq;
using MdsClient = Cps.CaseManagement.MdsClient.Client;
using Cps.CaseManagement.MdsClient.Exceptions;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.MdsClient.Models.Entities;
using Moq;
using Moq.Protected;
using Microsoft.Extensions.Logging;
using System.Text;

namespace Cps.CaseManagement.MdsClient.Tests.Client;

public class MdsClientTests
{
    private readonly Fixture _fixture;
    private readonly Mock<IMdsRequestFactory> _mdsRequestFactoryMock;
    private readonly Mock<HttpMessageHandler> _httpMessageHandlerMock;
    private readonly HttpClient _httpClient;
    private readonly Mock<ILogger<MdsClient.Client.MdsClient>> _loggerMock;
    private readonly MdsClient.Client.MdsClient _client;
    private readonly MdsBaseArgDto _mdsBaseArgDto;
    private readonly MdsUnitIdArg _mdsUnitIdArg;

    private const string TestUrl = "https://example.com";

    public MdsClientTests()
    {
        _fixture = new Fixture();
        _fixture.Customize(new AutoMoqCustomization());

        _mdsRequestFactoryMock = new Mock<IMdsRequestFactory>();
        _httpMessageHandlerMock = new Mock<HttpMessageHandler>();

        _httpClient = new HttpClient(_httpMessageHandlerMock.Object)
        {
            BaseAddress = new Uri(TestUrl)
        };
        _loggerMock = new Mock<ILogger<MdsClient.Client.MdsClient>>();

        _mdsBaseArgDto = _fixture.Create<MdsBaseArgDto>();
        _mdsUnitIdArg = _fixture.Create<MdsUnitIdArg>();


        _client = new MdsClient.Client.MdsClient(_httpClient, _mdsRequestFactoryMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task GetTitlesAsync_ReturnsExpectedTitles_WhenResponseIsSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/titles");
        var expectedTitles = _fixture.CreateMany<TitleEntity>(3).ToList();

        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetTitlesRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(expectedTitles, HttpStatusCode.OK);

        // Act
        var result = await _client.GetTitlesAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(expectedTitles.Count, resultList.Count);
    }

    [Fact]
    public async Task GetTitlesAsync_ThrowsMdsClientException_WhenResponseIsUnauthorized()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/titles");
        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetTitlesRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(new List<TitleEntity>(), HttpStatusCode.Unauthorized);

        // Act & Assert
        await Assert.ThrowsAsync<CmsUnauthorizedException>(() => _client.GetTitlesAsync(_mdsBaseArgDto));
    }

    [Fact]
    public async Task GetTitlesAsync_ThrowsMdsClientException_WhenResponseIsNotSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/titles");
        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetTitlesRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(new List<TitleEntity>(), HttpStatusCode.BadRequest);

        // Act & Assert
        await Assert.ThrowsAsync<MdsClientException>(() => _client.GetTitlesAsync(_mdsBaseArgDto));
    }

    [Fact]
    public async Task GetReligionsAsync_ReturnsExpectedReligions_WhenResponseIsSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/religions");
        var expectedReligions = _fixture.CreateMany<ReligionEntity>(3).ToList();

        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetReligionsRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(expectedReligions, HttpStatusCode.OK);

        // Act
        var result = await _client.GetReligionsAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(expectedReligions.Count, resultList.Count);
    }

    [Fact]
    public async Task GetReligionsAsync_ThrowsMdsClientException_WhenResponseIsNotSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/religions");
        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetReligionsRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(new List<ReligionEntity>(), HttpStatusCode.InternalServerError);

        // Act & Assert
        await Assert.ThrowsAsync<MdsClientException>(() => _client.GetReligionsAsync(_mdsBaseArgDto));
    }

    [Fact]
    public async Task GetGendersAsync_ReturnsExpectedGenders_WhenResponseIsSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/genders");
        var expectedGenders = _fixture.CreateMany<GenderEntity>(2).ToList();

        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetGendersRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(expectedGenders, HttpStatusCode.OK);

        // Act
        var result = await _client.GetGendersAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(expectedGenders.Count, resultList.Count);
    }

    [Fact]
    public async Task GetGendersAsync_ThrowsCmsUnauthorizedException_WhenResponseIsUnauthorized()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/genders");
        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetGendersRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(new List<GenderEntity>(), HttpStatusCode.Unauthorized);

        // Act & Assert
        await Assert.ThrowsAsync<CmsUnauthorizedException>(() => _client.GetGendersAsync(_mdsBaseArgDto));
    }

    [Fact]
    public async Task GetEthnicitiesAsync_ReturnsExpectedEthnicities_WhenResponseIsSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/ethnicities");
        var expectedEthnicities = _fixture.CreateMany<EthnicityEntity>(5).ToList();

        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetEthnicitesRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(expectedEthnicities, HttpStatusCode.OK);

        // Act
        var result = await _client.GetEthnicitiesAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(expectedEthnicities.Count, resultList.Count);
    }

    [Fact]
    public async Task GetEthnicitiesAsync_ThrowsMdsClientException_WhenResponseIsNotSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/ethnicities");
        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetEthnicitesRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(new List<EthnicityEntity>(), HttpStatusCode.Forbidden);

        // Act & Assert
        await Assert.ThrowsAsync<MdsClientException>(() => _client.GetEthnicitiesAsync(_mdsBaseArgDto));
    }

    [Fact]
    public async Task GetMonitoringCodesAsync_ReturnsExpectedMonitoringCodes_WhenResponseIsSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/monitoring-codes");
        var expectedMonitoringCodes = _fixture.CreateMany<MonitoringCodeEntity>(4).ToList();

        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetMonitoringCodesRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(expectedMonitoringCodes, HttpStatusCode.OK);

        // Act
        var result = await _client.GetMonitoringCodesAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(expectedMonitoringCodes.Count, resultList.Count);
    }

    [Fact]
    public async Task GetMonitoringCodesAsync_ThrowsMdsClientException_WhenResponseIsNotSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/monitoring-codes");
        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetMonitoringCodesRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(new List<MonitoringCodeEntity>(), HttpStatusCode.NotFound);

        // Act & Assert
        await Assert.ThrowsAsync<MdsClientException>(() => _client.GetMonitoringCodesAsync(_mdsBaseArgDto));
    }

    [Fact]
    public async Task GetComplexityCodesAsync_ReturnsExpectedComplexityCodes_WhenResponseIsSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/complexity-codes");
        var expectedComplexityCodes = _fixture.CreateMany<ComplexitityEntity>(3).ToList();

        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetComplexitiesRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(expectedComplexityCodes, HttpStatusCode.OK);

        // Act
        var result = await _client.GetComplexityCodesAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(expectedComplexityCodes.Count, resultList.Count);
    }

    [Fact]
    public async Task GetComplexityCodesAsync_ThrowsMdsClientException_WhenResponseIsNotSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/complexity-codes");
        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetComplexitiesRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(new List<ComplexitityEntity>(), HttpStatusCode.ServiceUnavailable);

        // Act & Assert
        await Assert.ThrowsAsync<MdsClientException>(() => _client.GetComplexityCodesAsync(_mdsBaseArgDto));
    }

    [Fact]
    public async Task GetOffenderCategoriesAsync_ReturnsExpectedOffenderCategories_WhenResponseIsSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/offender-categories");
        var expectedOffenderCategories = _fixture.CreateMany<OffenderCategoryEntity>(6).ToList();

        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetOffenderCategoriesRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(expectedOffenderCategories, HttpStatusCode.OK);

        // Act
        var result = await _client.GetOffenderCategoriesAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(expectedOffenderCategories.Count, resultList.Count);
    }

    [Fact]
    public async Task GetOffenderCategoriesAsync_ThrowsMdsClientException_WhenResponseIsNotSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/offender-categories");
        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetOffenderCategoriesRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(new List<OffenderCategoryEntity>(), HttpStatusCode.BadGateway);

        // Act & Assert
        await Assert.ThrowsAsync<MdsClientException>(() => _client.GetOffenderCategoriesAsync(_mdsBaseArgDto));
    }

    [Fact]
    public async Task GetProsecutorsAsync_ReturnsExpectedProsecutors_WhenResponseIsSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/prosecutors");
        var expectedProsecutors = _fixture.CreateMany<ProsecutorOrCaseworkerEntity>(4).ToList();

        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetProsecutorsRequest(_mdsUnitIdArg))
            .Returns(mockRequest);

        SetupHttpMockResponse(expectedProsecutors, HttpStatusCode.OK);

        // Act
        var result = await _client.GetProsecutorsAsync(_mdsUnitIdArg);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(expectedProsecutors.Count, resultList.Count);
    }

    [Fact]
    public async Task GetProsecutorsAsync_ThrowsMdsClientException_WhenResponseIsNotSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/prosecutors");
        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetProsecutorsRequest(_mdsUnitIdArg))
            .Returns(mockRequest);

        SetupHttpMockResponse(new List<ProsecutorOrCaseworkerEntity>(), HttpStatusCode.InternalServerError);

        // Act & Assert
        await Assert.ThrowsAsync<MdsClientException>(() => _client.GetProsecutorsAsync(_mdsUnitIdArg));
    }

    [Fact]
    public async Task GetCaseworkersAsync_ReturnsExpectedCaseworkers_WhenResponseIsSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/caseworkers");
        var expectedCaseworkers = _fixture.CreateMany<ProsecutorOrCaseworkerEntity>(5).ToList();

        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetCaseworkersRequest(_mdsUnitIdArg))
            .Returns(mockRequest);

        SetupHttpMockResponse(expectedCaseworkers, HttpStatusCode.OK);

        // Act
        var result = await _client.GetCaseworkersAsync(_mdsUnitIdArg);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(expectedCaseworkers.Count, resultList.Count);
    }

    [Fact]
    public async Task GetCaseworkersAsync_ThrowsCmsUnauthorizedException_WhenResponseIsUnauthorized()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/caseworkers");
        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetCaseworkersRequest(_mdsUnitIdArg))
            .Returns(mockRequest);

        SetupHttpMockResponse(new List<ProsecutorOrCaseworkerEntity>(), HttpStatusCode.Unauthorized);

        // Act & Assert
        await Assert.ThrowsAsync<CmsUnauthorizedException>(() => _client.GetCaseworkersAsync(_mdsUnitIdArg));
    }

    [Fact]
    public async Task GetCourtsAsync_ReturnsExpectedCourts_WhenResponseIsSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/courts");
        var expectedCourts = _fixture.CreateMany<CourtEntity>(3).ToList();

        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetCourtsRequest(_mdsUnitIdArg))
            .Returns(mockRequest);

        SetupHttpMockResponse(expectedCourts, HttpStatusCode.OK);

        // Act
        var result = await _client.GetCourtsAsync(_mdsUnitIdArg);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(expectedCourts.Count, resultList.Count);
    }

    [Fact]
    public async Task GetCourtsAsync_ThrowsMdsClientException_WhenResponseIsNotSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/courts");
        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetCourtsRequest(_mdsUnitIdArg))
            .Returns(mockRequest);

        SetupHttpMockResponse(new List<CourtEntity>(), HttpStatusCode.RequestTimeout);

        // Act & Assert
        await Assert.ThrowsAsync<MdsClientException>(() => _client.GetCourtsAsync(_mdsUnitIdArg));
    }

    [Fact]
    public async Task GetUnitsAsync_ReturnsExpectedUnits_WhenResponseIsSuccessful()
    {
        // Arrange
        var mockUnitsRequest = new HttpRequestMessage(HttpMethod.Get, "api/units");
        var mockUserDataRequest = new HttpRequestMessage(HttpMethod.Get, "api/userdata");
        var expectedUnits = _fixture.CreateMany<UnitEntity>(7).ToList();
        var homeUnitId = expectedUnits[2].Id; // Pick one unit as home unit
        var expectedUserData = new UserDataEntity
        {
            HomeUnit = new HomeUnitEntity { UnitId = homeUnitId }
        };

        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetUnitsRequest(_mdsBaseArgDto))
            .Returns(mockUnitsRequest);

        _mdsRequestFactoryMock
            .Setup(f => f.CreateUserDataRequest(_mdsBaseArgDto))
            .Returns(mockUserDataRequest);

        var unitsContent = JsonSerializer.Serialize(expectedUnits);
        var userDataContent = JsonSerializer.Serialize(expectedUserData);

        _httpMessageHandlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.Is<HttpRequestMessage>(m => m.RequestUri!.AbsolutePath.EndsWith("/api/units")),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(unitsContent, Encoding.UTF8, "application/json")
            });

        _httpMessageHandlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.Is<HttpRequestMessage>(m => m.RequestUri!.AbsolutePath.EndsWith("/api/userdata")),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(userDataContent, Encoding.UTF8, "application/json")
            });

        // Act
        var result = await _client.GetUnitsAsync(_mdsBaseArgDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectedUnits.Count, result.AllUnits.Count);
        Assert.NotNull(result.HomeUnit);
        Assert.Equal(homeUnitId, result.HomeUnit.Id);
    }

    [Fact]
    public async Task GetUnitsAsync_ThrowsMdsClientException_WhenUnitsRequestFails()
    {
        // Arrange
        var mockUnitsRequest = new HttpRequestMessage(HttpMethod.Get, "api/units");
        var mockUserDataRequest = new HttpRequestMessage(HttpMethod.Get, "api/userdata");

        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetUnitsRequest(_mdsBaseArgDto))
            .Returns(mockUnitsRequest);

        _mdsRequestFactoryMock
            .Setup(f => f.CreateUserDataRequest(_mdsBaseArgDto))
            .Returns(mockUserDataRequest);

        _httpMessageHandlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.TooManyRequests,
                Content = new StringContent("Rate limit exceeded")
            });

        // Act & Assert
        await Assert.ThrowsAsync<MdsClientException>(() => _client.GetUnitsAsync(_mdsBaseArgDto));
    }

    [Fact]
    public async Task GetUnitsAsync_ThrowsMdsClientException_WhenUserDataRequestFails()
    {
        // Arrange
        var mockUnitsRequest = new HttpRequestMessage(HttpMethod.Get, "api/units");
        var mockUserDataRequest = new HttpRequestMessage(HttpMethod.Get, "api/userdata");
        var expectedUnits = _fixture.CreateMany<UnitEntity>(7).ToList();

        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetUnitsRequest(_mdsBaseArgDto))
            .Returns(mockUnitsRequest);

        _mdsRequestFactoryMock
            .Setup(f => f.CreateUserDataRequest(_mdsBaseArgDto))
            .Returns(mockUserDataRequest);

        var unitsContent = JsonSerializer.Serialize(expectedUnits);

        _httpMessageHandlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.Is<HttpRequestMessage>(m => m.RequestUri!.AbsolutePath.EndsWith("/api/units")),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(unitsContent, Encoding.UTF8, "application/json")
            });

        _httpMessageHandlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.Is<HttpRequestMessage>(m => m.RequestUri!.AbsolutePath.EndsWith("/api/userdata")),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Content = new StringContent("Server error")
            });

        // Act & Assert
        await Assert.ThrowsAsync<MdsClientException>(() => _client.GetUnitsAsync(_mdsBaseArgDto));
    }

    [Fact]
    public async Task GetUnitsAsync_ReturnsNullHomeUnit_WhenHomeUnitIdNotFound()
    {
        // Arrange
        var mockUnitsRequest = new HttpRequestMessage(HttpMethod.Get, "api/units");
        var mockUserDataRequest = new HttpRequestMessage(HttpMethod.Get, "api/userdata");
        var nonExistentUnitId = 99999;

        var expectedUnits = new List<UnitEntity>
        {
            new UnitEntity { Id = 1, Description = "Unit 1" },
            new UnitEntity { Id = 2, Description = "Unit 2" },
            new UnitEntity { Id = 3, Description = "Unit 3" },
            new UnitEntity { Id = 4, Description = "Unit 4" },
            new UnitEntity { Id = 5, Description = "Unit 5" },
            new UnitEntity { Id = 6, Description = "Unit 6" },
            new UnitEntity { Id = 7, Description = "Unit 7" }
        };

        var expectedUserData = new UserDataEntity
        {
            HomeUnit = new HomeUnitEntity { UnitId = nonExistentUnitId }
        };

        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetUnitsRequest(_mdsBaseArgDto))
            .Returns(mockUnitsRequest);

        _mdsRequestFactoryMock
            .Setup(f => f.CreateUserDataRequest(_mdsBaseArgDto))
            .Returns(mockUserDataRequest);

        var unitsContent = JsonSerializer.Serialize(expectedUnits);
        var userDataContent = JsonSerializer.Serialize(expectedUserData);

        _httpMessageHandlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.Is<HttpRequestMessage>(m => m.RequestUri!.AbsolutePath.EndsWith("/api/units")),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(unitsContent, Encoding.UTF8, "application/json")
            });

        _httpMessageHandlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.Is<HttpRequestMessage>(m => m.RequestUri!.AbsolutePath.EndsWith("/api/userdata")),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(userDataContent, Encoding.UTF8, "application/json")
            });

        // Act
        var result = await _client.GetUnitsAsync(_mdsBaseArgDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectedUnits.Count, result.AllUnits.Count);
        Assert.Null(result.HomeUnit);
    }

    [Fact]
    public async Task GetTitlesAsync_ThrowsInvalidOperationException_WhenDeserializationReturnsNull()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/titles");
        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetTitlesRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        // Setup response with content that deserializes to null
        SetupHttpMockResponseWithContent("null", HttpStatusCode.OK);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _client.GetTitlesAsync(_mdsBaseArgDto));
    }

    [Fact]
    public async Task GetWMSUnitsAsync_ReturnsExpectedWMSUnits_WhenResponseIsSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/wms-units");
        var expectedUnits = _fixture.CreateMany<WMSUnitEntity>(7).ToList();

        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetWMSUnitsRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(expectedUnits, HttpStatusCode.OK);

        // Act
        var result = await _client.GetWMSUnitsAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(expectedUnits.Count, resultList.Count);
    }

    [Fact]
    public async Task GetWMSUnitsAsync_ThrowsMdsClientException_WhenResponseIsNotSuccessful()
    {
        // Arrange
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, "api/wms-units");
        _mdsRequestFactoryMock
            .Setup(f => f.CreateGetWMSUnitsRequest(_mdsBaseArgDto))
            .Returns(mockRequest);

        SetupHttpMockResponse(new List<WMSUnitEntity>(), HttpStatusCode.TooManyRequests);

        // Act & Assert
        await Assert.ThrowsAsync<MdsClientException>(() => _client.GetWMSUnitsAsync(_mdsBaseArgDto));
    }

    [Fact]
    public async Task ListCasesByUrnAsync_ReturnsExpectedCases_WhenResponseIsSuccessful()
    {
        // Arrange
        var mdsUrnArg = _fixture.Create<MdsUrnArg>();
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, $"api/urns/{mdsUrnArg.Urn}/case-identifiers");
        var expectedCases = _fixture.CreateMany<CaseInfoEntity>(5).ToList();

        _mdsRequestFactoryMock
            .Setup(f => f.CreateListCasesByUrnRequest(mdsUrnArg))
            .Returns(mockRequest);

        SetupHttpMockResponse(expectedCases, HttpStatusCode.OK);

        // Act
        var result = await _client.ListCasesByUrnAsync(mdsUrnArg);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(expectedCases.Count, resultList.Count);
    }

    [Fact]
    public async Task ListCasesByUrnAsync_ReturnsEmptyList_WhenNoCasesFound()
    {
        // Arrange
        var mdsUrnArg = _fixture.Create<MdsUrnArg>();
        var mockRequest = new HttpRequestMessage(HttpMethod.Get, $"api/urns/{mdsUrnArg.Urn}/case-identifiers");
        var expectedCases = new List<CaseInfoEntity>();

        _mdsRequestFactoryMock
            .Setup(f => f.CreateListCasesByUrnRequest(mdsUrnArg))
            .Returns(mockRequest);

        SetupHttpMockResponse(expectedCases, HttpStatusCode.OK);

        // Act
        var result = await _client.ListCasesByUrnAsync(mdsUrnArg);

        // Assert
        var resultList = result.ToList();
        Assert.Empty(resultList);
    }

    private void SetupHttpMockResponse<T>(T response, HttpStatusCode statusCode)
    {
        var content = JsonSerializer.Serialize(response);
        SetupHttpMockResponseWithContent(content, statusCode);
    }

    private void SetupHttpMockResponseWithContent(string content, HttpStatusCode statusCode)
    {
        _httpMessageHandlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = statusCode,
                Content = new StringContent(content)
            });
    }
}