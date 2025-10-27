namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public record CaseRegistrationMonitoringCode(
    [property: JsonPropertyName("code")] string Code,
    [property: JsonPropertyName("selected")] bool Selected
);