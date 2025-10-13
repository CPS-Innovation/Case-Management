namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public class CmsModernTokenEntity
{
    [JsonPropertyName("cmsModernToken")]
    public string CmsModernToken { get; set; } = string.Empty;
}
