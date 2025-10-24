namespace Cps.CaseManagement.Api.Models.Dto;

using System.Text.Json.Serialization;

public class CaseInfoDto
{
    [JsonPropertyName("urn")]
    public string Urn { get; set; } = string.Empty;
}
