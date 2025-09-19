
namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public class ComplexitityEntity
{
    [JsonPropertyName("shortCode")]
    public string ShortCode { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
}
