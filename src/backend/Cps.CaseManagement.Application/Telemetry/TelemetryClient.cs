namespace Cps.CaseManagement.Application.Telemetry;

using System;
using System.Collections.Generic;
using Microsoft.ApplicationInsights.DataContracts;
using AppInsights = Microsoft.ApplicationInsights;

public class TelemetryClient : ITelemetryClient
{   
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

    public void TrackException(BaseTelemetryEvent telemetryEvent)
    {
        if (telemetryEvent == null)
            return;

        var (properties, metrics) = PrepareTelemetryEventProps(telemetryEvent, true);

        var exceptionMessage = properties?["exceptionMessage"]?.ToString() ?? "Exception occurred";
        var exceptionStackTrace = properties?["exceptionStackTrace"]?.ToString() ?? string.Empty;
        var exception = new Exception(exceptionMessage);

        _telemetryClient.TrackException(exception, properties, metrics);
    }

    public void TrackMetric(BaseTelemetryEvent telemetryEvent)
    {
        if (telemetryEvent == null)
            return;

        var (properties, metrics) = PrepareTelemetryEventProps(telemetryEvent);

        if (metrics == null)
            return;

        foreach (var metric in metrics)
        {
            _telemetryClient.TrackMetric(
                metric.Key,
                metric.Value,
                properties);
        }
    }

    public void TrackPageView(BaseTelemetryEvent telemetryEvent)
    {
        if (telemetryEvent == null)
            return;

        var (properties, metrics) = PrepareTelemetryEventProps(telemetryEvent);

        var pageName = properties?["pageName"]?.ToString() ?? string.Empty;

        if (string.IsNullOrEmpty(pageName))
            return;

        _telemetryClient.TrackPageView(pageName);
    }

    public void TrackTrace(BaseTelemetryEvent telemetryEvent)
    {
        if (telemetryEvent == null)
            return;

        var (properties, metrics) = PrepareTelemetryEventProps(telemetryEvent);

        var message = properties?["message"]?.ToString() ?? string.Empty;
        var severityLevel = properties?["severityLevel"]?.ToString() ?? "Information";

        SeverityLevel appInsightsSeverityLevel = SeverityLevel.Information;
        Enum.TryParse<SeverityLevel>(severityLevel, true, out appInsightsSeverityLevel);

        _telemetryClient.TrackTrace(message,
            appInsightsSeverityLevel,
            properties);
    }

    private void TrackInternalEvent(BaseTelemetryEvent telemetryEvent, bool isFailure = false)
    {
        if (telemetryEvent == null)
            return;

        var (properties, metrics) = PrepareTelemetryEventProps(telemetryEvent, isFailure);

        _telemetryClient.TrackEvent(
            PrepareEventName(telemetryEvent.EventName),
            properties,
            metrics
        );
    }

    private (IDictionary<string, string> Properties, IDictionary<string, double>? Metrics) PrepareTelemetryEventProps(BaseTelemetryEvent telemetryEvent, bool isFailure = false)
    {
        var (properties, metrics) = telemetryEvent.ToTelemetryEventProps();

        var nonNullMetrics = metrics.Where(kvp => kvp.Value.HasValue)
                                    .ToDictionary(kvp => kvp.Key, kvp => kvp.Value!.Value);

        if (!telemetryEvent.CorrelationId.Equals(Guid.Empty))
        {
            properties["correlationId"] = telemetryEvent.CorrelationId.ToString();
        }

        if (telemetryEvent.EventTimestamp != DateTime.MinValue)
        {
            properties["eventTimestamp"] = telemetryEvent.EventTimestamp.ToString("dd/MM/yyyy HH:mm:ss.fff");
        }

        if (isFailure)
        {
            properties["isFailure"] = "true";
        }

        return (PrepareKeyNames(properties), PrepareKeyNames(nonNullMetrics));
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