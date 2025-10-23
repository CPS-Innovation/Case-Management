namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public class CaseRegistrationCharge
{
    [JsonPropertyName("offenceCode")]
    public string OffenceCode { get; set; } = string.Empty;

    [JsonPropertyName("offenceDescription")]
    public string OffenceDescription { get; set; } = string.Empty;

    [JsonPropertyName("offenceId")]
    public string OffenceId { get; set; } = string.Empty;

    [JsonPropertyName("dateFrom")]
    public DateTime DateFrom { get; set; }

    [JsonPropertyName("dateTo")]
    public DateTime? DateTo { get; set; }

    [JsonPropertyName("comment")]
    public string Comment { get; set; } = string.Empty;

    [JsonPropertyName("offenceLocation")]
    public CaseRegistrationOffenceLocation OffenceLocation { get; set; } = new();

    [JsonPropertyName("victimIndexId")]
    public int VictimIndexId { get; set; } = -1;

    [JsonPropertyName("chargeDetailsSummary")]
    public string ChargeDetailsSummary { get; set; } = string.Empty;

    [JsonPropertyName("modeOfTrial")]
    public string ModeOfTrial { get; set; } = string.Empty;
}