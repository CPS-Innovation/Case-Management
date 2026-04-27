namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public class OffencesEntity
{
    [JsonPropertyName("offences")]
    public required OffenceEntity[] Offences { get; set; }
    [JsonPropertyName("total")]
    public int Total { get; set; }
}

public class OffenceEntity
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
    [JsonPropertyName("modeOfTrial")]
    public string? ModeOfTrial { get; set; }
    [JsonPropertyName("cmsId")]
    public int? CmsId { get; set; }
    [JsonPropertyName("cmsModeOfTrial")]
    public CmsModeOfTrialEntity? CmsModeOfTrial { get; set; }
}

public class CmsModeOfTrialEntity
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }
    [JsonPropertyName("name")]
    public string? Name { get; set; }
}