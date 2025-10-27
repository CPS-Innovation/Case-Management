namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public class CaseRegistrationOffenceLocation
{
    [JsonPropertyName("addressLine1")]
    public string AddressLine1 { get; set; } = string.Empty;

    [JsonPropertyName("addressLine2")]
    public string AddressLine2 { get; set; } = string.Empty;

    [JsonPropertyName("townCity")]
    public string TownCity { get; set; } = string.Empty;

    [JsonPropertyName("postcode")]
    public string Postcode { get; set; } = string.Empty;
}