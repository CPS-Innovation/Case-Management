namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public class WMSUnitEntity
{
    [JsonPropertyName("areaId")]
    public long AreaId { get; set; }
    [JsonPropertyName("areaDescription")]
    public string AreaDescription { get; set; } = string.Empty;
    [JsonPropertyName("id")]
    public long Id { get; set; }
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    [JsonPropertyName("isWCU")]
    public bool IsWCU { get; set; } = false;
}