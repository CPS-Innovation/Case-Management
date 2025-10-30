namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public class CaseRegistrationEntity
{
    [JsonPropertyName("caseId")]
    public long CaseId { get; set; }

    [JsonPropertyName("urn")]
    public string Urn { get; set; } = string.Empty;
}