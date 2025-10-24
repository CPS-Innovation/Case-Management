namespace Cps.CaseManagement.Api.Models.Dto;

using System.Text.Json.Serialization;

public class ComplexityDto
{
    [JsonPropertyName("shortCode")]
    public string ShortCode { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
}
