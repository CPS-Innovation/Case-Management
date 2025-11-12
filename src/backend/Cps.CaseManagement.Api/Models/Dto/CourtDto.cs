namespace Cps.CaseManagement.Api.Models.Dto;

using System.Text.Json.Serialization;

public class CourtDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
}
