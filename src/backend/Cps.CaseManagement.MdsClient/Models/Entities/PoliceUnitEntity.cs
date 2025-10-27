namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public class PoliceUnitEntity
{
    [JsonPropertyName("unitId")]
    public long UnitId { get; set; }
    [JsonPropertyName("unitDescription")]
    public string UnitDescription { get; set; } = string.Empty;
    [JsonPropertyName("code")]
    public required string Code { get; set; }
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
}