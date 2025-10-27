namespace Cps.CaseManagement.Application.Telemetry;

using System;
using System.Collections.Generic;
using AppInsights = Microsoft.ApplicationInsights;

public class TelemetryClient : ITelemetryClient
{
    public const string telemetryVersion = nameof(telemetryVersion);
    public const string Version = "0.1";
    protected readonly AppInsights.TelemetryClient _telemetryClient;

    public TelemetryClient(AppInsights.TelemetryClient telemetryClient)
    {
        _telemetryClient = telemetryClient;
    }

    public void TrackEvent(BaseTelemetryEvent telemetryEvent)
    {
        TrackInternalEvent(telemetryEvent, isFailure: false);
    }

    public void TrackEventFailure(BaseTelemetryEvent telemetryEvent)
    {
        TrackInternalEvent(telemetryEvent, isFailure: true);
    }

    public void TrackInternalEvent(BaseTelemetryEvent telemetryEvent, bool isFailure = false)
    {
        if (telemetryEvent == null)
        {
            return;
        }

        var (properties, metrics) = telemetryEvent.ToTelemetryEventProps();

        var nonNullMetrics = metrics.Where(kvp => kvp.Value.HasValue)
                                    .ToDictionary(kvp => kvp.Key, kvp => kvp.Value!.Value);

        if (!properties.ContainsKey(telemetryVersion))
        {
            properties[telemetryVersion] = Version;
        }

        if (isFailure)
        {
            properties["isFailure"] = "true";
        }

        _telemetryClient.TrackEvent(
            PrepareEventName(telemetryEvent.EventName),
            PrepareKeyNames(properties),
            PrepareKeyNames(nonNullMetrics)
        );
    }

    private static string PrepareEventName(string eventName)
    {
        if (!eventName.EndsWith("Event"))
        {
            return eventName;
        }

        return eventName.Remove(eventName.LastIndexOf("Event"));
    }

    private static IDictionary<string, T> PrepareKeyNames<T>(IDictionary<string, T>? properties)
    {
        var cleanedProperties = new Dictionary<string, T>();

        if (properties == null)
        {
            return cleanedProperties;
        }

        foreach (var property in properties)
        {
            cleanedProperties[CleanPropertyName(property.Key)] = property.Value;
        }

        return cleanedProperties;
    }

    private static string CleanPropertyName(string name)
    {
        var propertyName = name.Replace("_", string.Empty);

        return ToLowerFirstChar(propertyName);
    }
    
    public static string ToLowerFirstChar(string input)
    {
        if (string.IsNullOrEmpty(input) || char.IsLower(input, 0))
        {
            return input;
        }

        return char.ToLower(input[0]) + input.Substring(1);
    }
}