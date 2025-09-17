using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Cps.CaseManagement.Api.Extensions;
using Cps.CaseManagement.Api.Validators;
using Cps.CaseManagement.Api.Middleware;

using var loggerFactory = LoggerFactory.Create(configure => configure.AddConsole());
var logger = loggerFactory.CreateLogger("Configuration");

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication(webApp =>
    {
        // note: the order of middleware is important, as it determines the execution flow
        webApp.UseMiddleware<ExceptionHandlingMiddleware>();
        webApp.UseMiddleware<RequestValidationMiddleware>();
    }) // ✅ Adds ASP.NET Core integration
    .ConfigureLogging((context, logging) =>
    {
        // Clear providers to avoid conflicts with default filtering
        logging.ClearProviders();

        var connectionString = context.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"];
        if (!string.IsNullOrEmpty(connectionString))
        {
            logging.AddApplicationInsights(
                configureTelemetryConfiguration: (config) => config.ConnectionString = connectionString,
                configureApplicationInsightsLoggerOptions: (options) => { }
            );
        }

        if (context.HostingEnvironment.IsDevelopment())
        {
            logging.AddConsole();
        }

        // Read minimum log level from configuration, fallback to Information if not set or invalid
        var logLevelString = context.Configuration["Logging:LogLevel:Default"];
        if (!Enum.TryParse<LogLevel>(logLevelString, true, out var minLevel))
        {
            minLevel = LogLevel.Information;
        }
        logging.SetMinimumLevel(minLevel);
    })
    .ConfigureAppConfiguration((context, config) =>
    {
        // ✅ Configure Azure Key Vault if KeyVaultUri is provided
        config.AddKeyVaultIfConfigured(config.Build(), logger);
    })
    .ConfigureServices((context, services) =>
    {
        // Get configuration for service registrations
        var configuration = context.Configuration;

        services
            .AddApplicationInsightsTelemetryWorkerService()
            .ConfigureFunctionsApplicationInsights();

        services.AddSingleton<IAuthorizationValidator, AuthorizationValidator>();

        services.AddSingleton(provider =>
        {
            return new ConfigurationManager<OpenIdConnectConfiguration>(
                        $"https://login.microsoftonline.com/{configuration["TenantId"]}/v2.0/.well-known/openid-configuration",
                        new OpenIdConnectConfigurationRetriever(),
                        new HttpDocumentRetriever());
        });

        // Service registrations
    })
    .Build();

await host.RunAsync();
