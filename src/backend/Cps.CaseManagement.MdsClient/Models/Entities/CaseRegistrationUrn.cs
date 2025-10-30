namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public class CaseRegistrationUrn
{
    [JsonPropertyName("policeForce")]
    public string PoliceForce { get; set; } = string.Empty;

    [JsonPropertyName("policeUnit")]
    public string PoliceUnit { get; set; } = string.Empty;

    [JsonPropertyName("uniqueRef")]
    public string UniqueRef { get; set; } = string.Empty;

    [JsonPropertyName("year")]
    public int Year { get; set; }

    public string Value => $"{this.PoliceForce}{this.PoliceUnit}{this.UniqueRef}{this.Year.ToString()}";
}