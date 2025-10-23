namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public class CaseRegistrationVictim
{
    [JsonPropertyName("surname")]
    public string Surname { get; set; } = string.Empty;

    [JsonPropertyName("forename")]
    public string Forename { get; set; } = string.Empty;

    [JsonPropertyName("isVulnerable")]
    public bool IsVulnerable { get; set; }

    [JsonPropertyName("isIntimidated")]
    public bool IsIntimidated { get; set; }

    [JsonPropertyName("isWitness")]
    public bool IsWitness { get; set; }
}