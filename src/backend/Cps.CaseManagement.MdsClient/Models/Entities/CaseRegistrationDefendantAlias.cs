namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public record CaseRegistrationDefendantAlias(
    [property: JsonPropertyName("listOrder")] int ListOrder,
    [property: JsonPropertyName("surname")] string Surname,
    [property: JsonPropertyName("firstNames")] string FirstNames);