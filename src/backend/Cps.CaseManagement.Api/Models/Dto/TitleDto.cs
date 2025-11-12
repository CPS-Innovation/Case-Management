namespace Cps.CaseManagement.Api.Models.Dto;

using System.Text.Json.Serialization;

public class TitleDto
{
    [JsonPropertyName("shortCode")]
    public string ShortCode { get; set; } = string.Empty;
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    [JsonPropertyName("display")]
    public string Display { get; set; } = string.Empty;
    [JsonPropertyName("isPoliceTitle")]
    public bool? IsPoliceTitle { get; set; }
}