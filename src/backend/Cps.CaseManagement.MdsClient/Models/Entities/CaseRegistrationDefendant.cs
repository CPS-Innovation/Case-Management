namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public class CaseRegistrationDefendant
{
    [JsonPropertyName("isDefendant")]
    public bool IsDefendant { get; set; }

    [JsonPropertyName("surname")]
    public string Surname { get; set; } = string.Empty;

    [JsonPropertyName("firstname")]
    public string Firstname { get; set; } = string.Empty;

    [JsonPropertyName("companyName")]
    public string CompanyName { get; set; } = string.Empty;

    [JsonPropertyName("dateOfBirth")]
    public DateTime? DateOfBirth { get; set; }

    [JsonPropertyName("gender")]
    public string Gender { get; set; } = string.Empty;

    [JsonPropertyName("disability")]
    public string Disability { get; set; } = string.Empty;

    [JsonPropertyName("ethnicity")]
    public string Ethnicity { get; set; } = string.Empty;

    [JsonPropertyName("religion")]
    public string Religion { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;

    [JsonPropertyName("arrestDate")]
    public DateTime? ArrestDate { get; set; }

    [JsonPropertyName("seriousDangerousOffender")]
    public bool SeriousDangerousOffender { get; set; }

    [JsonPropertyName("aliases")]
    public ICollection<CaseRegistrationDefendantAlias> Aliases { get; set; } = [];

    [JsonPropertyName("arrestSummonsNumber")]
    public string JsonPropertyNameArrestSummonsNumber { get; set; } = string.Empty;

    public int NumberOfCharges => this.Charges.Count;

    [JsonPropertyName("charges")]
    public ICollection<CaseRegistrationCharge> Charges { get; set; } = [];
}