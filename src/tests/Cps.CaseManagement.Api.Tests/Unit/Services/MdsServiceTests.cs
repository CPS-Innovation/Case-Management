namespace Cps.CaseManagement.Api.Tests.Unit.Services;

using AutoFixture;
using AutoFixture.AutoMoq;
using Cps.CaseManagement.Api.Mappers;
using Cps.CaseManagement.Api.Models.Dto;
using Cps.CaseManagement.Api.Services;
using Cps.CaseManagement.MdsClient.Client;
using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.MdsClient.Models.Entities;
using Microsoft.Extensions.Logging;
using Moq;


public class MdsServiceTests
{
    private readonly Fixture _fixture;
    private readonly Mock<IMdsClient> _mdsClientMock;
    private readonly Mock<IMdsMapper> _mdsMapperMock;
    private readonly Mock<ILogger<MdsService>> _loggerMock;
    private readonly MdsService _service;
    private readonly MdsBaseArgDto _mdsBaseArgDto;
    private readonly MdsUnitIdArg _mdsUnitIdArg;

    public MdsServiceTests()
    {
        _fixture = new Fixture();
        _fixture.Customize(new AutoMoqCustomization());

        _fixture.Customize<DateOnly>(c => c.FromFactory(() => new DateOnly(2024, 1, 1)));
        _fixture.Customize<DateOnly?>(c => c.FromFactory(() => new DateOnly(2024, 1, 1)));

        _mdsClientMock = new Mock<IMdsClient>();
        _mdsMapperMock = new Mock<IMdsMapper>();
        _loggerMock = new Mock<ILogger<MdsService>>();

        _mdsBaseArgDto = _fixture.Create<MdsBaseArgDto>();
        _mdsUnitIdArg = _fixture.Create<MdsUnitIdArg>();

        _service = new MdsService(_mdsClientMock.Object, _mdsMapperMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task GetTitlesAsync_ReturnsExpectedTitles_WhenResponseIsSuccessful()
    {
        // Arrange
        var titleEntities = _fixture.CreateMany<TitleEntity>(3).ToList();
        var titleDtos = _fixture.CreateMany<TitleDto>(3).ToList();

        _mdsClientMock
            .Setup(c => c.GetTitlesAsync(_mdsBaseArgDto))
            .ReturnsAsync(titleEntities);

        for (int i = 0; i < titleEntities.Count; i++)
        {
            _mdsMapperMock
                .Setup(m => m.MapTitleEntityToDto(titleEntities[i]))
                .Returns(titleDtos[i]);
        }

        // Act
        var result = await _service.GetTitlesAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(titleDtos.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.GetTitlesAsync(_mdsBaseArgDto), Times.Once);
        foreach (var entity in titleEntities)
        {
            _mdsMapperMock.Verify(m => m.MapTitleEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task GetTitlesAsync_FiltersPoliceTitle_WhenIsPoliceTitleIsTrue()
    {
        // Arrange
        var titleEntities = new List<TitleEntity>
            {
                _fixture.Build<TitleEntity>().With(t => t.IsPoliceTitle, true).Create(),
                _fixture.Build<TitleEntity>().With(t => t.IsPoliceTitle, false).Create(),
                _fixture.Build<TitleEntity>().With(t => t.IsPoliceTitle, true).Create()
            };
        var titleDto = _fixture.Create<TitleDto>();

        _mdsClientMock
            .Setup(c => c.GetTitlesAsync(_mdsBaseArgDto))
            .ReturnsAsync(titleEntities);

        // For each entity we expect mapping when filter selects them
        var selectedEntities = titleEntities.Where(t => t.IsPoliceTitle).ToList();
        foreach (var ent in selectedEntities)
        {
            _mdsMapperMock
                .Setup(m => m.MapTitleEntityToDto(ent))
                .Returns(titleDto);
        }

        // Act
        var result = await _service.GetTitlesAsync(_mdsBaseArgDto, isPoliceTitle: true);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(selectedEntities.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.GetTitlesAsync(_mdsBaseArgDto), Times.Once);
        foreach (var entity in selectedEntities)
        {
            _mdsMapperMock.Verify(m => m.MapTitleEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task GetTitlesAsync_FiltersPoliceTitle_WhenIsPoliceTitleIsFalse()
    {
        // Arrange
        var titleEntities = new List<TitleEntity>
            {
                _fixture.Build<TitleEntity>().With(t => t.IsPoliceTitle, true).Create(),
                _fixture.Build<TitleEntity>().With(t => t.IsPoliceTitle, false).Create(),
                _fixture.Build<TitleEntity>().With(t => t.IsPoliceTitle, false).Create()
            };
        var titleDto = _fixture.Create<TitleDto>();

        _mdsClientMock
            .Setup(c => c.GetTitlesAsync(_mdsBaseArgDto))
            .ReturnsAsync(titleEntities);

        var selectedEntities = titleEntities.Where(t => t.IsPoliceTitle == false).ToList();
        foreach (var ent in selectedEntities)
        {
            _mdsMapperMock
                .Setup(m => m.MapTitleEntityToDto(ent))
                .Returns(titleDto);
        }

        // Act
        var result = await _service.GetTitlesAsync(_mdsBaseArgDto, isPoliceTitle: false);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(selectedEntities.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.GetTitlesAsync(_mdsBaseArgDto), Times.Once);
        foreach (var entity in selectedEntities)
        {
            _mdsMapperMock.Verify(m => m.MapTitleEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task GetTitlesAsync_DoesNotFilter_WhenIsPoliceTitleIsNull()
    {
        // Arrange
        var titleEntities = new List<TitleEntity>
            {
                _fixture.Build<TitleEntity>().With(t => t.IsPoliceTitle, true).Create(),
                _fixture.Build<TitleEntity>().With(t => t.IsPoliceTitle, false).Create(),
                _fixture.Build<TitleEntity>().With(t => t.IsPoliceTitle, true).Create()
            };
        var titleDto = _fixture.Create<TitleDto>();

        _mdsClientMock
            .Setup(c => c.GetTitlesAsync(_mdsBaseArgDto))
            .ReturnsAsync(titleEntities);

        foreach (var ent in titleEntities)
        {
            _mdsMapperMock
                .Setup(m => m.MapTitleEntityToDto(ent))
                .Returns(titleDto);
        }

        // Act
        var result = await _service.GetTitlesAsync(_mdsBaseArgDto, isPoliceTitle: null);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(titleEntities.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.GetTitlesAsync(_mdsBaseArgDto), Times.Once);
        foreach (var entity in titleEntities)
        {
            _mdsMapperMock.Verify(m => m.MapTitleEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task GetReligionsAsync_ReturnsExpectedReligions_WhenResponseIsSuccessful()
    {
        // Arrange
        var religionEntities = _fixture.CreateMany<ReligionEntity>(3).ToList();
        var religionDtos = _fixture.CreateMany<ReligionDto>(3).ToList();

        _mdsClientMock
            .Setup(c => c.GetReligionsAsync(_mdsBaseArgDto))
            .ReturnsAsync(religionEntities);

        for (int i = 0; i < religionEntities.Count; i++)
        {
            _mdsMapperMock
                .Setup(m => m.MapReligionEntityToDto(religionEntities[i]))
                .Returns(religionDtos[i]);
        }

        // Act
        var result = await _service.GetReligionsAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(religionDtos.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.GetReligionsAsync(_mdsBaseArgDto), Times.Once);
        foreach (var entity in religionEntities)
        {
            _mdsMapperMock.Verify(m => m.MapReligionEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task GetGendersAsync_ReturnsExpectedGenders_WhenResponseIsSuccessful()
    {
        // Arrange
        var genderEntities = _fixture.CreateMany<GenderEntity>(2).ToList();
        var genderDtos = _fixture.CreateMany<GenderDto>(2).ToList();

        _mdsClientMock
            .Setup(c => c.GetGendersAsync(_mdsBaseArgDto))
            .ReturnsAsync(genderEntities);

        for (int i = 0; i < genderEntities.Count; i++)
        {
            _mdsMapperMock
                .Setup(m => m.MapGenderEntityToDto(genderEntities[i]))
                .Returns(genderDtos[i]);
        }

        // Act
        var result = await _service.GetGendersAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(genderDtos.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.GetGendersAsync(_mdsBaseArgDto), Times.Once);
        foreach (var entity in genderEntities)
        {
            _mdsMapperMock.Verify(m => m.MapGenderEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task GetEthnicitiesAsync_ReturnsExpectedEthnicities_WhenResponseIsSuccessful()
    {
        // Arrange
        var ethnicityEntities = _fixture.CreateMany<EthnicityEntity>(5).ToList();
        var ethnicityDtos = _fixture.CreateMany<EthnicityDto>(5).ToList();

        _mdsClientMock
            .Setup(c => c.GetEthnicitiesAsync(_mdsBaseArgDto))
            .ReturnsAsync(ethnicityEntities);

        for (int i = 0; i < ethnicityEntities.Count; i++)
        {
            _mdsMapperMock
                .Setup(m => m.MapEthnicityEntityToDto(ethnicityEntities[i]))
                .Returns(ethnicityDtos[i]);
        }

        // Act
        var result = await _service.GetEthnicitiesAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(ethnicityDtos.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.GetEthnicitiesAsync(_mdsBaseArgDto), Times.Once);
        foreach (var entity in ethnicityEntities)
        {
            _mdsMapperMock.Verify(m => m.MapEthnicityEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task GetMonitoringCodesAsync_ReturnsExpectedMonitoringCodes_WhenResponseIsSuccessful()
    {
        // Arrange
        var monitoringCodeEntities = _fixture.CreateMany<MonitoringCodeEntity>(4).ToList();
        var monitoringCodeDtos = _fixture.CreateMany<MonitoringCodeDto>(4).ToList();

        _mdsClientMock
            .Setup(c => c.GetMonitoringCodesAsync(_mdsBaseArgDto))
            .ReturnsAsync(monitoringCodeEntities);

        for (int i = 0; i < monitoringCodeEntities.Count; i++)
        {
            _mdsMapperMock
                .Setup(m => m.MapMonitoringCodeEntityToDto(monitoringCodeEntities[i]))
                .Returns(monitoringCodeDtos[i]);
        }

        // Act
        var result = await _service.GetMonitoringCodesAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(monitoringCodeDtos.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.GetMonitoringCodesAsync(_mdsBaseArgDto), Times.Once);
        foreach (var entity in monitoringCodeEntities)
        {
            _mdsMapperMock.Verify(m => m.MapMonitoringCodeEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task GetComplexityCodesAsync_ReturnsExpectedComplexityCodes_WhenResponseIsSuccessful()
    {
        // Arrange
        var complexityEntities = _fixture.CreateMany<ComplexitityEntity>(3).ToList();
        var complexityDtos = _fixture.CreateMany<ComplexityDto>(3).ToList();

        _mdsClientMock
            .Setup(c => c.GetComplexityCodesAsync(_mdsBaseArgDto))
            .ReturnsAsync(complexityEntities);

        for (int i = 0; i < complexityEntities.Count; i++)
        {
            _mdsMapperMock
                .Setup(m => m.MapComplexityEntityToDto(complexityEntities[i]))
                .Returns(complexityDtos[i]);
        }

        // Act
        var result = await _service.GetComplexityCodesAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(complexityDtos.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.GetComplexityCodesAsync(_mdsBaseArgDto), Times.Once);
        foreach (var entity in complexityEntities)
        {
            _mdsMapperMock.Verify(m => m.MapComplexityEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task GetOffenderCategoriesAsync_ReturnsExpectedOffenderCategories_WhenResponseIsSuccessful()
    {
        // Arrange
        var offenderCategoryEntities = _fixture.CreateMany<OffenderCategoryEntity>(6).ToList();
        var offenderCategoryDtos = _fixture.CreateMany<OffenderCategoryDto>(6).ToList();

        _mdsClientMock
            .Setup(c => c.GetOffenderCategoriesAsync(_mdsBaseArgDto))
            .ReturnsAsync(offenderCategoryEntities);

        for (int i = 0; i < offenderCategoryEntities.Count; i++)
        {
            _mdsMapperMock
                .Setup(m => m.MapOffenderCategoryEntityToDto(offenderCategoryEntities[i]))
                .Returns(offenderCategoryDtos[i]);
        }

        // Act
        var result = await _service.GetOffenderCategoriesAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(offenderCategoryDtos.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.GetOffenderCategoriesAsync(_mdsBaseArgDto), Times.Once);
        foreach (var entity in offenderCategoryEntities)
        {
            _mdsMapperMock.Verify(m => m.MapOffenderCategoryEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task GetProsecutorsAsync_ReturnsExpectedProsecutors_WhenResponseIsSuccessful()
    {
        // Arrange
        var prosecutorEntities = _fixture.CreateMany<ProsecutorOrCaseworkerEntity>(4).ToList();
        var prosecutorDtos = _fixture.CreateMany<ProsecutorOrCaseworkerDto>(4).ToList();

        _mdsClientMock
            .Setup(c => c.GetProsecutorsAsync(_mdsUnitIdArg))
            .ReturnsAsync(prosecutorEntities);

        for (int i = 0; i < prosecutorEntities.Count; i++)
        {
            _mdsMapperMock
                .Setup(m => m.MapProsecutorOrCaseworkerEntityToDto(prosecutorEntities[i]))
                .Returns(prosecutorDtos[i]);
        }

        // Act
        var result = await _service.GetProsecutorsAsync(_mdsUnitIdArg);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(prosecutorDtos.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.GetProsecutorsAsync(_mdsUnitIdArg), Times.Once);
        foreach (var entity in prosecutorEntities)
        {
            _mdsMapperMock.Verify(m => m.MapProsecutorOrCaseworkerEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task GetCaseworkersAsync_ReturnsExpectedCaseworkers_WhenResponseIsSuccessful()
    {
        // Arrange
        var caseworkerEntities = _fixture.CreateMany<ProsecutorOrCaseworkerEntity>(5).ToList();
        var caseworkerDtos = _fixture.CreateMany<ProsecutorOrCaseworkerDto>(5).ToList();

        _mdsClientMock
            .Setup(c => c.GetCaseworkersAsync(_mdsUnitIdArg))
            .ReturnsAsync(caseworkerEntities);

        for (int i = 0; i < caseworkerEntities.Count; i++)
        {
            _mdsMapperMock
                .Setup(m => m.MapProsecutorOrCaseworkerEntityToDto(caseworkerEntities[i]))
                .Returns(caseworkerDtos[i]);
        }

        // Act
        var result = await _service.GetCaseworkersAsync(_mdsUnitIdArg);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(caseworkerDtos.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.GetCaseworkersAsync(_mdsUnitIdArg), Times.Once);
        foreach (var entity in caseworkerEntities)
        {
            _mdsMapperMock.Verify(m => m.MapProsecutorOrCaseworkerEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task GetCourtsAsync_ReturnsExpectedCourts_WhenResponseIsSuccessful()
    {
        // Arrange
        var courtEntities = _fixture.CreateMany<CourtEntity>(3).ToList();
        var courtDtos = _fixture.CreateMany<CourtDto>(3).ToList();

        _mdsClientMock
            .Setup(c => c.GetCourtsAsync(_mdsUnitIdArg))
            .ReturnsAsync(courtEntities);

        for (int i = 0; i < courtEntities.Count; i++)
        {
            _mdsMapperMock
                .Setup(m => m.MapCourtEntityToDto(courtEntities[i]))
                .Returns(courtDtos[i]);
        }

        // Act
        var result = await _service.GetCourtsAsync(_mdsUnitIdArg);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(courtDtos.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.GetCourtsAsync(_mdsUnitIdArg), Times.Once);
        foreach (var entity in courtEntities)
        {
            _mdsMapperMock.Verify(m => m.MapCourtEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task GetUnitsAsync_ReturnsExpectedUnitsDto_WhenResponseIsSuccessful()
    {
        // Arrange
        var unitEntities = _fixture.CreateMany<UnitEntity>(5).ToList();
        var userDataEntity = _fixture.Create<UserDataEntity>();
        var expectedUnitsDto = _fixture.Create<UnitsDto>();

        _mdsClientMock
            .Setup(c => c.GetUnitsAsync(_mdsBaseArgDto))
            .ReturnsAsync(unitEntities);

        _mdsClientMock
            .Setup(c => c.GetUserDataAsync(_mdsBaseArgDto))
            .ReturnsAsync(userDataEntity);

        _mdsMapperMock
            .Setup(m => m.MapUnitsAndUserDataToDto(unitEntities, userDataEntity.HomeUnit.UnitId))
            .Returns(expectedUnitsDto);

        // Act
        var result = await _service.GetUnitsAsync(_mdsBaseArgDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectedUnitsDto, result);
        _mdsClientMock.Verify(c => c.GetUnitsAsync(_mdsBaseArgDto), Times.Once);
        _mdsClientMock.Verify(c => c.GetUserDataAsync(_mdsBaseArgDto), Times.Once);
        _mdsMapperMock.Verify(m => m.MapUnitsAndUserDataToDto(unitEntities, userDataEntity.HomeUnit.UnitId), Times.Once);
    }

    [Fact]
    public async Task GetWMSUnitsAsync_ReturnsExpectedWMSUnits_WhenResponseIsSuccessful()
    {
        // Arrange
        var wmsUnitEntities = _fixture.CreateMany<WMSUnitEntity>(7).ToList();
        var wmsUnitDtos = _fixture.CreateMany<WMSUnitDto>(7).ToList();

        _mdsClientMock
            .Setup(c => c.GetWMSUnitsAsync(_mdsBaseArgDto))
            .ReturnsAsync(wmsUnitEntities);

        for (int i = 0; i < wmsUnitEntities.Count; i++)
        {
            _mdsMapperMock
                .Setup(m => m.MapWMSUnitEntityToDto(wmsUnitEntities[i]))
                .Returns(wmsUnitDtos[i]);
        }

        // Act
        var result = await _service.GetWMSUnitsAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(wmsUnitDtos.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.GetWMSUnitsAsync(_mdsBaseArgDto), Times.Once);
        foreach (var entity in wmsUnitEntities)
        {
            _mdsMapperMock.Verify(m => m.MapWMSUnitEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task ListCasesByUrnAsync_ReturnsExpectedCases_WhenResponseIsSuccessful()
    {
        // Arrange
        var mdsUrnArg = _fixture.Create<MdsUrnArg>();
        var caseInfoEntities = _fixture.CreateMany<CaseInfoEntity>(5).ToList();
        var caseInfoDtos = _fixture.CreateMany<CaseInfoDto>(5).ToList();

        _mdsClientMock
            .Setup(c => c.ListCasesByUrnAsync(mdsUrnArg))
            .ReturnsAsync(caseInfoEntities);

        for (int i = 0; i < caseInfoEntities.Count; i++)
        {
            _mdsMapperMock
                .Setup(m => m.MapCaseInfoEntityToDto(caseInfoEntities[i]))
                .Returns(caseInfoDtos[i]);
        }

        // Act
        var result = await _service.ListCasesByUrnAsync(mdsUrnArg);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(caseInfoDtos.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.ListCasesByUrnAsync(mdsUrnArg), Times.Once);
        foreach (var entity in caseInfoEntities)
        {
            _mdsMapperMock.Verify(m => m.MapCaseInfoEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task GetCmsModernTokenAsync_ReturnsExpectedToken_WhenResponseIsSuccessful()
    {
        // Arrange
        var expectedToken = _fixture.Create<string>();

        _mdsClientMock
            .Setup(c => c.GetCmsModernTokenAsync(_mdsBaseArgDto))
            .ReturnsAsync(expectedToken);

        // Act
        var result = await _service.GetCmsModernTokenAsync(_mdsBaseArgDto);

        // Assert
        Assert.Equal(expectedToken, result);
        _mdsClientMock.Verify(c => c.GetCmsModernTokenAsync(_mdsBaseArgDto), Times.Once);
    }

    [Fact]
    public async Task GetCmsModernTokenAsync_ReturnsNull_WhenTokenIsNull()
    {
        // Arrange
        _mdsClientMock
            .Setup(c => c.GetCmsModernTokenAsync(_mdsBaseArgDto))
            .ReturnsAsync((string?)null);

        // Act
        var result = await _service.GetCmsModernTokenAsync(_mdsBaseArgDto);

        // Assert
        Assert.Null(result);
        _mdsClientMock.Verify(c => c.GetCmsModernTokenAsync(_mdsBaseArgDto), Times.Once);
    }

    [Fact]
    public async Task GetPoliceUnitsAsync_ReturnsExpectedPoliceUnits_WhenResponseIsSuccessful()
    {
        // Arrange
        var policeUnitEntities = _fixture.CreateMany<PoliceUnitEntity>(4).ToList();
        var policeUnitDtos = _fixture.CreateMany<PoliceUnitDto>(4).ToList();

        _mdsClientMock
            .Setup(c => c.GetPoliceUnitsAsync(_mdsBaseArgDto))
            .ReturnsAsync(policeUnitEntities);

        for (int i = 0; i < policeUnitEntities.Count; i++)
        {
            _mdsMapperMock
                .Setup(m => m.MapPoliceUnitEntityToDto(policeUnitEntities[i]))
                .Returns(policeUnitDtos[i]);
        }

        // Act
        var result = await _service.GetPoliceUnitsAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(policeUnitDtos.Count, resultList.Count);
        _mdsClientMock.Verify(c => c.GetPoliceUnitsAsync(_mdsBaseArgDto), Times.Once);
        foreach (var entity in policeUnitEntities)
        {
            _mdsMapperMock.Verify(m => m.MapPoliceUnitEntityToDto(entity), Times.Once);
        }
    }

    [Fact]
    public async Task SearchOffences_ReturnsExpectedOffences_WhenResponseIsSuccessful()
    {
        // Arrange
        var mdsOffenceSearchArg = _fixture.Create<MdsOffenceSearchArg>();
        var offencesEntity = _fixture.Create<OffencesEntity>();
        var offencesDto = _fixture.Create<OffencesDto>();

        _mdsClientMock
            .Setup(c => c.SearchOffences(mdsOffenceSearchArg))
            .ReturnsAsync(offencesEntity);

        _mdsMapperMock
            .Setup(m => m.MapOffencesEntityToDto(offencesEntity))
            .Returns(offencesDto);

        // Act
        var result = await _service.SearchOffences(mdsOffenceSearchArg);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(offencesDto, result);
        _mdsClientMock.Verify(c => c.SearchOffences(mdsOffenceSearchArg), Times.Once);
        _mdsMapperMock.Verify(m => m.MapOffencesEntityToDto(offencesEntity), Times.Once);
    }

    [Fact]
    public async Task GetTitlesAsync_ReturnsEmptyList_WhenNoTitlesFound()
    {
        // Arrange
        var emptyList = new List<TitleEntity>();

        _mdsClientMock
            .Setup(c => c.GetTitlesAsync(_mdsBaseArgDto))
            .ReturnsAsync(emptyList);

        // Act
        var result = await _service.GetTitlesAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Empty(resultList);
        _mdsClientMock.Verify(c => c.GetTitlesAsync(_mdsBaseArgDto), Times.Once);
        _mdsMapperMock.Verify(m => m.MapTitleEntityToDto(It.IsAny<TitleEntity>()), Times.Never);
    }

    [Fact]
    public async Task ListCasesByUrnAsync_ReturnsEmptyList_WhenNoCasesFound()
    {
        // Arrange
        var mdsUrnArg = _fixture.Create<MdsUrnArg>();
        var emptyList = new List<CaseInfoEntity>();

        _mdsClientMock
            .Setup(c => c.ListCasesByUrnAsync(mdsUrnArg))
            .ReturnsAsync(emptyList);

        // Act
        var result = await _service.ListCasesByUrnAsync(mdsUrnArg);

        // Assert
        var resultList = result.ToList();
        Assert.Empty(resultList);
        _mdsClientMock.Verify(c => c.ListCasesByUrnAsync(mdsUrnArg), Times.Once);
        _mdsMapperMock.Verify(m => m.MapCaseInfoEntityToDto(It.IsAny<CaseInfoEntity>()), Times.Never);
    }

    [Fact]
    public async Task GetReligionsAsync_ReturnsEmptyList_WhenNoReligionsFound()
    {
        // Arrange
        var emptyList = new List<ReligionEntity>();

        _mdsClientMock
            .Setup(c => c.GetReligionsAsync(_mdsBaseArgDto))
            .ReturnsAsync(emptyList);

        // Act
        var result = await _service.GetReligionsAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Empty(resultList);
        _mdsClientMock.Verify(c => c.GetReligionsAsync(_mdsBaseArgDto), Times.Once);
        _mdsMapperMock.Verify(m => m.MapReligionEntityToDto(It.IsAny<ReligionEntity>()), Times.Never);
    }

    [Fact]
    public async Task GetGendersAsync_ReturnsEmptyList_WhenNoGendersFound()
    {
        // Arrange
        var emptyList = new List<GenderEntity>();

        _mdsClientMock
            .Setup(c => c.GetGendersAsync(_mdsBaseArgDto))
            .ReturnsAsync(emptyList);

        // Act
        var result = await _service.GetGendersAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Empty(resultList);
        _mdsClientMock.Verify(c => c.GetGendersAsync(_mdsBaseArgDto), Times.Once);
        _mdsMapperMock.Verify(m => m.MapGenderEntityToDto(It.IsAny<GenderEntity>()), Times.Never);
    }

    [Fact]
    public async Task GetEthnicitiesAsync_ReturnsEmptyList_WhenNoEthnicitiesFound()
    {
        // Arrange
        var emptyList = new List<EthnicityEntity>();

        _mdsClientMock
            .Setup(c => c.GetEthnicitiesAsync(_mdsBaseArgDto))
            .ReturnsAsync(emptyList);

        // Act
        var result = await _service.GetEthnicitiesAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Empty(resultList);
        _mdsClientMock.Verify(c => c.GetEthnicitiesAsync(_mdsBaseArgDto), Times.Once);
        _mdsMapperMock.Verify(m => m.MapEthnicityEntityToDto(It.IsAny<EthnicityEntity>()), Times.Never);
    }

    [Fact]
    public async Task GetMonitoringCodesAsync_ReturnsEmptyList_WhenNoMonitoringCodesFound()
    {
        // Arrange
        var emptyList = new List<MonitoringCodeEntity>();

        _mdsClientMock
            .Setup(c => c.GetMonitoringCodesAsync(_mdsBaseArgDto))
            .ReturnsAsync(emptyList);

        // Act
        var result = await _service.GetMonitoringCodesAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Empty(resultList);
        _mdsClientMock.Verify(c => c.GetMonitoringCodesAsync(_mdsBaseArgDto), Times.Once);
        _mdsMapperMock.Verify(m => m.MapMonitoringCodeEntityToDto(It.IsAny<MonitoringCodeEntity>()), Times.Never);
    }

    [Fact]
    public async Task GetComplexityCodesAsync_ReturnsEmptyList_WhenNoComplexityCodesFound()
    {
        // Arrange
        var emptyList = new List<ComplexitityEntity>();

        _mdsClientMock
            .Setup(c => c.GetComplexityCodesAsync(_mdsBaseArgDto))
            .ReturnsAsync(emptyList);

        // Act
        var result = await _service.GetComplexityCodesAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Empty(resultList);
        _mdsClientMock.Verify(c => c.GetComplexityCodesAsync(_mdsBaseArgDto), Times.Once);
        _mdsMapperMock.Verify(m => m.MapComplexityEntityToDto(It.IsAny<ComplexitityEntity>()), Times.Never);
    }

    [Fact]
    public async Task GetOffenderCategoriesAsync_ReturnsEmptyList_WhenNoOffenderCategoriesFound()
    {
        // Arrange
        var emptyList = new List<OffenderCategoryEntity>();

        _mdsClientMock
            .Setup(c => c.GetOffenderCategoriesAsync(_mdsBaseArgDto))
            .ReturnsAsync(emptyList);

        // Act
        var result = await _service.GetOffenderCategoriesAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Empty(resultList);
        _mdsClientMock.Verify(c => c.GetOffenderCategoriesAsync(_mdsBaseArgDto), Times.Once);
        _mdsMapperMock.Verify(m => m.MapOffenderCategoryEntityToDto(It.IsAny<OffenderCategoryEntity>()), Times.Never);
    }

    [Fact]
    public async Task GetProsecutorsAsync_ReturnsEmptyList_WhenNoProsecutorsFound()
    {
        // Arrange
        var emptyList = new List<ProsecutorOrCaseworkerEntity>();

        _mdsClientMock
            .Setup(c => c.GetProsecutorsAsync(_mdsUnitIdArg))
            .ReturnsAsync(emptyList);

        // Act
        var result = await _service.GetProsecutorsAsync(_mdsUnitIdArg);

        // Assert
        var resultList = result.ToList();
        Assert.Empty(resultList);
        _mdsClientMock.Verify(c => c.GetProsecutorsAsync(_mdsUnitIdArg), Times.Once);
        _mdsMapperMock.Verify(m => m.MapProsecutorOrCaseworkerEntityToDto(It.IsAny<ProsecutorOrCaseworkerEntity>()), Times.Never);
    }

    [Fact]
    public async Task GetCaseworkersAsync_ReturnsEmptyList_WhenNoCaseworkersFound()
    {
        // Arrange
        var emptyList = new List<ProsecutorOrCaseworkerEntity>();

        _mdsClientMock
            .Setup(c => c.GetCaseworkersAsync(_mdsUnitIdArg))
            .ReturnsAsync(emptyList);

        // Act
        var result = await _service.GetCaseworkersAsync(_mdsUnitIdArg);

        // Assert
        var resultList = result.ToList();
        Assert.Empty(resultList);
        _mdsClientMock.Verify(c => c.GetCaseworkersAsync(_mdsUnitIdArg), Times.Once);
        _mdsMapperMock.Verify(m => m.MapProsecutorOrCaseworkerEntityToDto(It.IsAny<ProsecutorOrCaseworkerEntity>()), Times.Never);
    }

    [Fact]
    public async Task GetCourtsAsync_ReturnsEmptyList_WhenNoCourtsFound()
    {
        // Arrange
        var emptyList = new List<CourtEntity>();

        _mdsClientMock
            .Setup(c => c.GetCourtsAsync(_mdsUnitIdArg))
            .ReturnsAsync(emptyList);

        // Act
        var result = await _service.GetCourtsAsync(_mdsUnitIdArg);

        // Assert
        var resultList = result.ToList();
        Assert.Empty(resultList);
        _mdsClientMock.Verify(c => c.GetCourtsAsync(_mdsUnitIdArg), Times.Once);
        _mdsMapperMock.Verify(m => m.MapCourtEntityToDto(It.IsAny<CourtEntity>()), Times.Never);
    }

    [Fact]
    public async Task GetWMSUnitsAsync_ReturnsEmptyList_WhenNoWMSUnitsFound()
    {
        // Arrange
        var emptyList = new List<WMSUnitEntity>();

        _mdsClientMock
            .Setup(c => c.GetWMSUnitsAsync(_mdsBaseArgDto))
            .ReturnsAsync(emptyList);

        // Act
        var result = await _service.GetWMSUnitsAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Empty(resultList);
        _mdsClientMock.Verify(c => c.GetWMSUnitsAsync(_mdsBaseArgDto), Times.Once);
        _mdsMapperMock.Verify(m => m.MapWMSUnitEntityToDto(It.IsAny<WMSUnitEntity>()), Times.Never);
    }

    [Fact]
    public async Task GetPoliceUnitsAsync_ReturnsEmptyList_WhenNoPoliceUnitsFound()
    {
        // Arrange
        var emptyList = new List<PoliceUnitEntity>();

        _mdsClientMock
            .Setup(c => c.GetPoliceUnitsAsync(_mdsBaseArgDto))
            .ReturnsAsync(emptyList);

        // Act
        var result = await _service.GetPoliceUnitsAsync(_mdsBaseArgDto);

        // Assert
        var resultList = result.ToList();
        Assert.Empty(resultList);
        _mdsClientMock.Verify(c => c.GetPoliceUnitsAsync(_mdsBaseArgDto), Times.Once);
        _mdsMapperMock.Verify(m => m.MapPoliceUnitEntityToDto(It.IsAny<PoliceUnitEntity>()), Times.Never);
    }
}
