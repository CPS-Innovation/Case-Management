
namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public class CaseInfoEntity
{
    [JsonPropertyName("urn")]
    public string Urn { get; set; } = string.Empty;
}
