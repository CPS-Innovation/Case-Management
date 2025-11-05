namespace Cps.CaseManagement.Api.Models.Dto;

using System.Text.Json.Serialization;
using Cps.CaseManagement.MdsClient.Models.Entities;

public class UnitsDto
{
    [JsonPropertyName("allUnits")]
    public List<UnitEntity> AllUnits { get; set; } = [];

    [JsonPropertyName("homeUnit")]
    public UnitEntity? HomeUnit { get; set; }
}