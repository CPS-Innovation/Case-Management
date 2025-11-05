using Cps.CaseManagement.Infrastructure.Telemetry;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Cps.CaseManagement.Infrastructure.Extensions;

public static class IServiceCollectionExtension
{
    public static void AddTelemetryServices(this IServiceCollection services)
    {
        services.AddSingleton<ITelemetryInitializer, TelemetryInitializer>();
        services.AddSingleton<IAppInsightsTelemetryClient, AppInsightsTelemetryClientWrapper>();
        services.AddSingleton<ITelemetryClient, TelemetryClient>();
    }
}