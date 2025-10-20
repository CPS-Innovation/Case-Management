namespace Cps.CaseManagement.Api.Models.Dto;

using System.Text.Json.Serialization;

public class OffencesDto
{
    [JsonPropertyName("offences")]
    public required OffenceDto[] Offences { get; set; }
    [JsonPropertyName("total")]
    public int Total { get; set; }
}

public class OffenceDto
{
    [JsonPropertyName("code")]
    public string? Code { get; set; }
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    [JsonPropertyName("legislation")]
    public string? Legislation { get; set; }
    [JsonPropertyName("dppConsent")]
    public string? DPPConsent { get; set; }
    [JsonPropertyName("effectiveFromDate")]
    public DateTime? EffectiveFromDate { get; set; }
    [JsonPropertyName("effectiveToDate")]
    public DateTime? EffectiveToDate { get; set; }
}