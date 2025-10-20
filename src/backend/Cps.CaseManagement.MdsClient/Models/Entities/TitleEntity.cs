namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public class TitleEntity
{
    [JsonPropertyName("shortCode")]
    public string ShortCode { get; set; } = string.Empty;
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    [JsonPropertyName("isPoliceTitle")]
    public bool IsPoliceTitle { get; set; } = false;
}