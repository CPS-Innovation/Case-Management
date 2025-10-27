namespace Cps.CaseManagement.Api.Models.Domain;

using Cps.CaseManagement.Api.Constants;

public class UiTelemetry
{
    public TelemetryType TelemetryType { get; set; }
    public string EventName { get; set; } = string.Empty;
    public DateTime EventTimestamp { get; set; }
    public Dictionary<string, string> Properties { get; set; } = new();
}