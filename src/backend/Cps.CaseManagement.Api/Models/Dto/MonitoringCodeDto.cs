namespace Cps.CaseManagement.Api.Models.Dto;

using System.Text.Json.Serialization;

public class MonitoringCodeDto
{
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    [JsonPropertyName("display")]
    public string Display { get; set; } = string.Empty;
}