namespace Cps.CaseManagement.Api.Tests.Unit.Mappers;

using Microsoft.Extensions.Logging;
using AutoFixture;
using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Mappers;
using Cps.CaseManagement.MdsClient.Models.Entities;
using Moq;

public class MdsMapperTests
{
    private readonly Fixture _fixture;
    private readonly MdsMapper _mapper;

    public MdsMapperTests()
    {
        _fixture = new Fixture();
        _mapper = new MdsMapper(new Mock<ILogger<MdsMapper>>().Object);
    }

    [Fact]
    public void MapUnitsAndUserDataToDto_ReturnsExpectedDto_WhenHomeUnitExists()
    {
        var homeUnit = _fixture.Build<UnitEntity>().With(u => u.Id, 1L).Create();
        var otherUnits = _fixture.Build<UnitEntity>().With(u => u.Id, 2L).CreateMany(2).ToList();
        var allUnits = new List<UnitEntity> { homeUnit }.Concat(otherUnits).ToList();

        var result = _mapper.MapUnitsAndUserDataToDto(allUnits, 1L);

        Assert.Equal(allUnits, result.AllUnits);
        Assert.Equal(homeUnit, result.HomeUnit);
    }

    [Fact]
    public void MapUnitsAndUserDataToDto_ReturnsNullHomeUnit_WhenHomeUnitIdIsNull()
    {
        var allUnits = _fixture.CreateMany<UnitEntity>(3).ToList();

        var result = _mapper.MapUnitsAndUserDataToDto(allUnits, null);

        Assert.Equal(allUnits, result.AllUnits);
        Assert.Null(result.HomeUnit);
    }

    [Fact]
    public void MapTitleEntityToDto_MapsExpectedValues()
    {
        var entity = new TitleEntity { ShortCode = "PCSO" };

        var result = _mapper.MapTitleEntityToDto(entity);

        Assert.Equal(entity.ShortCode, result.ShortCode);
        Assert.Equal("Police Community Support Officer", result.Description);
        Assert.Equal("Police Community Support Officer (PCSO)", result.Display);
    }

    [Fact]
    public void MapReligionEntityToDto_MapsExpectedValues()
    {
        var entity = _fixture.Create<ReligionEntity>();

        var result = _mapper.MapReligionEntityToDto(entity);

        Assert.Equal(entity.ShortCode, result.ShortCode);
        Assert.Equal(entity.Description, result.Description);
    }

    [Fact]
    public void MapGenderEntityToDto_MapsExpectedValues()
    {
        var entity = _fixture.Create<GenderEntity>();

        var result = _mapper.MapGenderEntityToDto(entity);

        Assert.Equal(entity.ShortCode, result.ShortCode);
        Assert.Equal(entity.Description, result.Description);
    }

    [Fact]
    public void MapEthnicityEntityToDto_MapsExpectedValues()
    {
        var entity = _fixture.Create<EthnicityEntity>();

        var result = _mapper.MapEthnicityEntityToDto(entity);

        Assert.Equal(entity.ShortCode, result.ShortCode);
        Assert.Equal(entity.Description, result.Description);
    }

    [Fact]
    public void MapMonitoringCodeEntityToDto_MapsExpectedValues()
    {
        var entity = new MonitoringCodeEntity { Code = "CAOP", Description = "Crime Against an Older Pe..." };

        var result = _mapper.MapMonitoringCodeEntityToDto(entity);

        Assert.Equal(entity.Code, result.Code);
        Assert.Equal(entity.Description, result.Description);
        Assert.Equal("Crime Against an Older Person", result.Display);
    }

    [Fact]
    public void MapComplexityEntityToDto_MapsExpectedValues()
    {
        var entity = _fixture.Create<ComplexitityEntity>();

        var result = _mapper.MapComplexityEntityToDto(entity);

        Assert.Equal(entity.ShortCode, result.ShortCode);
        Assert.Equal(entity.Description, result.Description);
    }

    [Fact]
    public void MapOffenderCategoryEntityToDto_MapsExpectedValues()
    {
        var entity = new OffenderCategoryEntity { ShortCode = "PP", Description = "Prolific priority offender" };

        var result = _mapper.MapOffenderCategoryEntityToDto(entity);

        Assert.Equal(entity.ShortCode, result.ShortCode);
        Assert.Equal("Prolific priority offender", result.Description);
        Assert.Equal("Prolific priority offender (PPO)", result.Display);
    }

    [Fact]
    public void MapProsecutorOrCaseworkerEntityToDto_MapsExpectedValues()
    {
        var entity = _fixture.Create<ProsecutorOrCaseworkerEntity>();

        var result = _mapper.MapProsecutorOrCaseworkerEntityToDto(entity);

        Assert.Equal(entity.Id, result.Id);
        Assert.Equal(entity.Description, result.Description);
    }

    [Fact]
    public void MapCourtEntityToDto_MapsExpectedValues()
    {
        var entity = _fixture.Create<CourtEntity>();

        var result = _mapper.MapCourtEntityToDto(entity);

        Assert.Equal(entity.Id, result.Id);
        Assert.Equal(entity.Description, result.Description);
    }

    [Fact]
    public void MapWMSUnitEntityToDto_MapsExpectedValues()
    {
        var entity = _fixture.Create<WMSUnitEntity>();

        var result = _mapper.MapWMSUnitEntityToDto(entity);

        Assert.Equal(entity.AreaId, result.AreaId);
        Assert.Equal(entity.AreaDescription, result.AreaDescription);
        Assert.Equal(entity.Id, result.Id);
        Assert.Equal(entity.Description, result.Description);
    }

    [Fact]
    public void MapCaseInfoEntityToDto_MapsExpectedValues()
    {
        var entity = _fixture.Create<CaseInfoEntity>();

        var result = _mapper.MapCaseInfoEntityToDto(entity);

        Assert.Equal(entity.Urn, result.Urn);
    }

    [Fact]
    public void MapPoliceUnitEntityToDto_MapsExpectedValues()
    {
        var entity = _fixture.Create<PoliceUnitEntity>();

        var result = _mapper.MapPoliceUnitEntityToDto(entity);

        Assert.Equal(entity.UnitId, result.UnitId);
        Assert.Equal(entity.UnitDescription, result.UnitDescription);
        Assert.Equal(entity.Code, result.Code);
        Assert.Equal(entity.Description, result.Description);
    }

    [Fact]
    public void MapOffencesEntityToDto_MapsExpectedValues()
    {
        var cmsModeOfTrial = _fixture.Create<CmsModeOfTrialEntity>();
        cmsModeOfTrial.Id = "S";
        var offence = _fixture.Build<OffenceEntity>()
            .With(o => o.CmsId, 42)
            .With(o => o.CmsModeOfTrial, cmsModeOfTrial)
            .Create();
        var entity = new OffencesEntity
        {
            Total = 1,
            Offences = [offence]
        };

        var result = _mapper.MapOffencesEntityToDto(entity);

        Assert.Equal(entity.Total, result.Total);
        Assert.Single(result.Offences);
        var mapped = result.Offences.First();
        Assert.Equal(offence.Code, mapped.Code);
        Assert.Equal(offence.Description, mapped.Description);
        Assert.Equal(offence.Legislation, mapped.Legislation);
        Assert.Equal(offence.DPPConsent, mapped.DPPConsent);
        Assert.Equal(offence.EffectiveFromDate, mapped.EffectiveFromDate);
        Assert.Equal(offence.EffectiveToDate, mapped.EffectiveToDate);
        Assert.Equal(offence.ModeOfTrial, mapped.ModeOfTrial);
        Assert.Equal(offence.CmsId, mapped.CmsId);
        Assert.Equal(CmsModeOfTrialShortCodes.SUM, mapped.CmsModeOfTrialShortCode);
    }

    [Fact]
    public void MapOffencesEntityToDto_ExcludesOffences_WhenCmsIdIsNull()
    {
        var cmsModeOfTrial = new CmsModeOfTrialEntity { Id = "S", Name = "Summary" };
        var offenceWithCmsId = _fixture.Build<OffenceEntity>()
            .With(o => o.CmsId, 1)
            .With(o => o.CmsModeOfTrial, cmsModeOfTrial)
            .Create();
        var offenceWithoutCmsId = _fixture.Build<OffenceEntity>()
            .With(o => o.CmsId, (int?)null)
            .Create();
        var entity = new OffencesEntity
        {
            Total = 2,
            Offences = [offenceWithCmsId, offenceWithoutCmsId]
        };

        var result = _mapper.MapOffencesEntityToDto(entity);

        Assert.Single(result.Offences);
        Assert.Equal(1, result.Total);
        Assert.Equal(offenceWithCmsId.Code, result.Offences.First().Code);
    }

    [Fact]
    public void MapOffencesEntityToDto_MapsCmsModeOfTrialShortCode_FromCmsModeOfTrialId()
    {
        var cmsModeOfTrial = new CmsModeOfTrialEntity { Id = "S", Name = "Summary" };
        var offence = _fixture.Build<OffenceEntity>()
            .With(o => o.CmsId, 10)
            .With(o => o.CmsModeOfTrial, cmsModeOfTrial)
            .Create();
        var entity = new OffencesEntity
        {
            Total = 1,
            Offences = [offence]
        };

        var result = _mapper.MapOffencesEntityToDto(entity);

        Assert.Equal("SUM", result.Offences.First().CmsModeOfTrialShortCode);
    }

    [Fact]
    public void MapOffencesEntityToDto_ExcludesOffences_WhenCmsModeOfTrialIdIsNull()
    {
        var cmsModeOfTrial = new CmsModeOfTrialEntity { Id = "S", Name = "Summary" };
        var offenceWithModeOfTrial = _fixture.Build<OffenceEntity>()
            .With(o => o.CmsId, 10)
            .With(o => o.CmsModeOfTrial, cmsModeOfTrial)
            .Create();
        var offenceWithNullModeOfTrial = _fixture.Build<OffenceEntity>()
            .With(o => o.CmsId, 11)
            .With(o => o.CmsModeOfTrial, (CmsModeOfTrialEntity?)null)
            .Create();
        var entity = new OffencesEntity
        {
            Total = 2,
            Offences = [offenceWithModeOfTrial, offenceWithNullModeOfTrial]
        };

        var result = _mapper.MapOffencesEntityToDto(entity);

        Assert.Single(result.Offences);
        Assert.Equal(offenceWithModeOfTrial.Code, result.Offences.First().Code);
    }

    [Fact]
    public void MapOffencesEntityToDto_MapsCmsModeOfTrialShortCode_AsNull_WhenCmsModeOfTrialIsNull()
    {
        var offence = _fixture.Build<OffenceEntity>()
            .With(o => o.CmsId, 10)
            .With(o => o.CmsModeOfTrial, (CmsModeOfTrialEntity?)null)
            .Create();
        var entity = new OffencesEntity
        {
            Total = 1,
            Offences = [offence]
        };

        var result = _mapper.MapOffencesEntityToDto(entity);

        Assert.Empty(result.Offences);
    }

    [Fact]
    public void MapTitleEntityToDto_ReturnsCode_WhenCodeNotInDictionary()
    {
        var entity = new TitleEntity { ShortCode = "XYZ" };

        var result = _mapper.MapTitleEntityToDto(entity);

        Assert.Equal("XYZ", result.ShortCode);
        Assert.Equal("XYZ", result.Description);
        Assert.Equal("XYZ", result.Display);
    }

    [Fact]
    public void MapOffenderCategoryEntityToDto_ReturnsCode_WhenCodeNotInDictionary()
    {
        var entity = new OffenderCategoryEntity { ShortCode = "UNK", Description = "Unknown" };

        var result = _mapper.MapOffenderCategoryEntityToDto(entity);

        Assert.Equal("UNK", result.ShortCode);
        Assert.Equal("Unknown", result.Description);
        Assert.Equal("UNK", result.Display);
    }
}
