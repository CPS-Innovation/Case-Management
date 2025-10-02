namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public class UserDataEntity
{
    [JsonPropertyName("homeUnit")]
    public required HomeUnitEntity HomeUnit { get; set; }
}

public class HomeUnitEntity
{
    [JsonPropertyName("unitId")]
    public long UnitId { get; set; }
}