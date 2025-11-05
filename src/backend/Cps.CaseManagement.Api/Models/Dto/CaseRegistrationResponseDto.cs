using System.Text.Json.Serialization;
using Cps.CaseManagement.MdsClient.Models.Entities;

namespace Cps.CaseManagement.Api.Models.Dto;

public class CaseRegistrationResponseDto
{
    [JsonPropertyName("caseId")]
    public long CaseId { get; set; }

    [JsonPropertyName("urn")]
    public string Urn { get; set; } = string.Empty;
}