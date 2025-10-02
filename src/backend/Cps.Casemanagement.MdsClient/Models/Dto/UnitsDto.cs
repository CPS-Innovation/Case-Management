using System.Text.Json.Serialization;
using Cps.CaseManagement.MdsClient.Models.Entities;

namespace CPS.CaseManagement.MdsClient.Models.Dto;

public class UnitsDto
{
    [JsonPropertyName("allUnits")]
    public List<UnitEntity> AllUnits { get; set; } = [];

    [JsonPropertyName("homeUnit")]
    public UnitEntity? HomeUnit { get; set; }
}