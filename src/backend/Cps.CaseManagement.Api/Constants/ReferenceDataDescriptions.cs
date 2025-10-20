namespace Cps.CaseManagement.Api.Constants;

/// <summary>
/// Contains lookup dictionaries for all reference data types that need full descriptions
/// </summary>
public static class ReferenceDataDescriptions
{
    private static readonly Dictionary<string, string> TitleDescriptions = new(StringComparer.OrdinalIgnoreCase)
    {
        { "Dr", "Doctor" },
        { "Miss", "Miss" },
        { "Mr", "Mister" },
        { "Mrs", "Missus" },
        { "Ms", "Ms" },
        { "Prof", "Professor" },
        { "Rev", "Reverend" },
        { "PC", "Police Constable" },
        { "DC", "Detective Constable" },
        { "PS", "Police Sergeant" },
        { "DS", "Detective Sergeant" },
        { "INS", "Inspector" },
        { "DI", "Detective Inspector" },
        { "PCSO", "Police Community Support Officer" },
        { "CI", "Chief Inspector" },
        { "SC", "Special Constable" }
    };

    private static readonly Dictionary<string, string> OffenderCategoryDescriptions = new(StringComparer.OrdinalIgnoreCase)
    {
        { "BP", "Both prolific priority offender (PPO) and prolific youth offender (PYO)" },
        { "PP", "Prolific priority offender (PPO)" },
        { "PY", "Prolific youth offender (PYO)" },
        { "YO", "Youth offender (YO)" },
        { "UN", "Unspecified" }
    };

    public static string GetTitleDescription(string code) =>
        GetDescription(TitleDescriptions, code);

    public static string GetTitleDisplayName(string code) =>
        GetDisplayName(TitleDescriptions, code);

    public static string GetOffenderCategoryDisplayName(string code) =>
        GetDisplayName(OffenderCategoryDescriptions, code);

    private static string GetDescription(Dictionary<string, string> dictionary, string code)
    {
        return dictionary.TryGetValue(code, out var description)
            ? description
            : code;
    }

    private static string GetDisplayName(Dictionary<string, string> dictionary, string code)
    {
        var description = GetDescription(dictionary, code);
        return description.Equals(code, StringComparison.OrdinalIgnoreCase)
            ? code
            : $"{description} ({code})";
    }
}