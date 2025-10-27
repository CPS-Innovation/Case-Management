namespace Cps.CaseManagement.Application.Telemetry;

public class BaseUiTelemetryEvent : BaseTelemetryEvent
{
    public Guid CorrelationId { get; set; } 
    public IDictionary<string, object> Properties { get; set; } = new Dictionary<string, object>();

    public override (IDictionary<string, string> Properties, IDictionary<string, double?> Metrics) ToTelemetryEventProps()
    {
        var properties = new Dictionary<string, string>();
        var metrics = new Dictionary<string, double?>();

        foreach (var kvp in Properties)
        {
            if (kvp.Value is string stringValue)
            {
                properties.Add(kvp.Key, stringValue);
            }
            else if (kvp.Value is int intValue)
            {
                metrics.Add(kvp.Key, intValue);
            }
            else if (kvp.Value is double doubleValue)
            {
                metrics.Add(kvp.Key, doubleValue);
            }
            else if (kvp.Value is float floatValue)
            {
                metrics.Add(kvp.Key, floatValue);
            }
            else if (kvp.Value is long longValue)
            {
                metrics.Add(kvp.Key, longValue);
            }
            else if (kvp.Value is decimal decimalValue)
            {
                metrics.Add(kvp.Key, (double)decimalValue);
            }
            else
            {
                properties.Add(kvp.Key, kvp.Value?.ToString() ?? string.Empty);
            }
        }

        return (properties, metrics);
    }
}