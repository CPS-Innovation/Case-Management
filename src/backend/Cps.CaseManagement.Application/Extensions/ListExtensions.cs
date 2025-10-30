namespace Cps.CaseManagement.Application.Extensions;

public static class ListExtensions
{
    public static object? GetDictionaryKeyValue(this List<Dictionary<string, object>> list, string key)
    {
        return list?.Where(x => x.ContainsKey(key))?.Select(x => x[key])?.FirstOrDefault()?.ToString();
    }
}