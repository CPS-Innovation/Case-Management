namespace Cps.CaseManagement.Api.Mappers;

using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Models.Dto;
using Cps.CaseManagement.MdsClient.Models.Entities;

public class MdsMapper : IMdsMapper
{
    public UnitsDto MapUnitsAndUserDataToDto(IEnumerable<UnitEntity> allUnits, long? homeUnitId)
    {
        return new UnitsDto
        {
            AllUnits = allUnits.ToList(),
            HomeUnit = homeUnitId is not null ? allUnits.FirstOrDefault(u => u.Id == homeUnitId) : null
        };
    }

    public TitleDto MapTitleEntityToDto(TitleEntity entity)
    {
        return new TitleDto
        {
            ShortCode = entity.ShortCode,
            Description = ReferenceDataDescriptions.GetTitleDescription(entity.ShortCode),
            Display = ReferenceDataDescriptions.GetTitleDisplayName(entity.ShortCode),
        };
    }

    public ReligionDto MapReligionEntityToDto(ReligionEntity entity)
    {
        return new ReligionDto
        {
            ShortCode = entity.ShortCode,
            Description = entity.Description,
        };
    }

    public GenderDto MapGenderEntityToDto(GenderEntity entity)
    {
        return new GenderDto
        {
            ShortCode = entity.ShortCode,
            Description = entity.Description,
        };
    }

    public EthnicityDto MapEthnicityEntityToDto(EthnicityEntity entity)
    {
        return new EthnicityDto
        {
            ShortCode = entity.ShortCode,
            Description = entity.Description,
        };
    }

    public MonitoringCodeDto MapMonitoringCodeEntityToDto(MonitoringCodeEntity entity)
    {
        return new MonitoringCodeDto
        {
            Code = entity.Code,
            Description = entity.Description,
        };
    }

    public ComplexityDto MapComplexityEntityToDto(ComplexitityEntity entity)
    {
        return new ComplexityDto
        {
            ShortCode = entity.ShortCode,
            Description = entity.Description,
        };
    }

    public OffenderCategoryDto MapOffenderCategoryEntityToDto(OffenderCategoryEntity entity)
    {
        return new OffenderCategoryDto
        {
            ShortCode = entity.ShortCode,
            Description = entity.Description,
            Display = ReferenceDataDescriptions.GetOffenderCategoryDisplayName(entity.ShortCode)
        };
    }

    public ProsecutorOrCaseworkerDto MapProsecutorOrCaseworkerEntityToDto(ProsecutorOrCaseworkerEntity entity)
    {
        return new ProsecutorOrCaseworkerDto
        {
            Id = entity.Id,
            Description = entity.Description,
        };
    }

    public CourtDto MapCourtEntityToDto(CourtEntity entity)
    {
        return new CourtDto
        {
            Id = entity.Id,
            Description = entity.Description,
        };
    }

    public WMSUnitDto MapWMSUnitEntityToDto(WMSUnitEntity entity)
    {
        return new WMSUnitDto
        {
            AreaId = entity.AreaId,
            AreaDescription = entity.AreaDescription,
            Id = entity.Id,
            Description = entity.Description,
        };
    }

    public CaseInfoDto MapCaseInfoEntityToDto(CaseInfoEntity entity)
    {
        return new CaseInfoDto
        {
            Urn = entity.Urn,
        };
    }

    public PoliceUnitDto MapPoliceUnitEntityToDto(PoliceUnitEntity entity)
    {
        return new PoliceUnitDto
        {
            UnitId = entity.UnitId,
            UnitDescription = entity.UnitDescription,
            Code = entity.Code,
            Description = entity.Description,
        };
    }

    public OffencesDto MapOffencesEntityToDto(OffencesEntity entity)
    {
        return new OffencesDto
        {
            Total = entity.Total,
            Offences = entity.Offences.Select(o => new OffenceDto
            {
                Code = o.Code,
                Description = o.Description,
                Legislation = o.Legislation,
                DPPConsent = o.DPPConsent,
                EffectiveFromDate = o.EffectiveFromDate,
                EffectiveToDate = o.EffectiveToDate
            }).ToArray()
        };
    }
}