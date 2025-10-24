namespace Cps.CaseManagement.Api.Models.Dto;

using System.Text.Json.Serialization;

public class ProsecutorOrCaseworkerDto
{
    [JsonPropertyName("id")]
    public long Id { get; set; }
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
}
