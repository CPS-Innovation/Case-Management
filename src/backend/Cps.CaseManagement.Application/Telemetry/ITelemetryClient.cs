namespace Cps.CaseManagement.Application.Telemetry;

public interface ITelemetryClient
{
    void TrackEvent(BaseTelemetryEvent telemetryEvent);
    void TrackEventFailure(BaseTelemetryEvent telemetryEvent);
}