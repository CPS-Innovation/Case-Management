using System.Net;
using System.Net.Http.Headers;
using Cps.CaseManagement.MdsClient.Factories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Polly;
using Polly.Contrib.WaitAndRetry;
using Polly.Retry;
using Microsoft.Extensions.Options;

namespace Cps.CaseManagement.MdsClient.Extensions;

public static class IServiceCollectionExtension
{
    private const int RetryAttempts = 1;
    private const int FirstRetryDelaySeconds = 1;

    public static void AddMdsClient(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<MdsOptions>(configuration.GetSection(nameof(MdsOptions)));
        services.AddHttpClient<MdsClient.Client.IMdsClient, MdsClient.Client.MdsClient>(AddMdsClient)
          .SetHandlerLifetime(TimeSpan.FromMinutes(5))
          .AddPolicyHandler(GetRetryPolicy());
        services.AddTransient<IMdsRequestFactory, MdsRequestFactory>();
        services.AddTransient<IMdsArgFactory, MdsArgFactory>();

    }

    internal static void AddMdsClient(IServiceProvider configuration, HttpClient client)
    {
        var opts = configuration.GetService<IOptions<MdsOptions>>()?.Value ?? throw new ArgumentNullException(nameof(MdsOptions));
        client.BaseAddress = new Uri(opts.BaseUrl);
        client.DefaultRequestHeaders.Add(MdsOptions.FunctionKey, opts.AccessKey);
        client.DefaultRequestHeaders.CacheControl = new CacheControlHeaderValue { NoCache = true };

        if (opts.BaseUrl.Contains(MdsOptions.DevtunnelUrlFragment) && !string.IsNullOrWhiteSpace(MdsOptions.DevtunnelTokenKey))
        {
            client.DefaultRequestHeaders.Add(MdsOptions.DevtunnelTokenKey, opts.DevtunnelToken);
        }
    }

    private static AsyncRetryPolicy<HttpResponseMessage> GetRetryPolicy()
    {
        // https://learn.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/implement-http-call-retries-exponential-backoff-polly#add-a-jitter-strategy-to-the-retry-policy
        var delay = Backoff.DecorrelatedJitterBackoffV2(
            medianFirstRetryDelay: TimeSpan.FromSeconds(FirstRetryDelaySeconds),
            retryCount: RetryAttempts);

        static bool responseStatusCodePredicate(HttpResponseMessage response) =>
            response.StatusCode >= HttpStatusCode.InternalServerError
            || response.StatusCode == HttpStatusCode.NotFound;

        static bool methodPredicate(HttpResponseMessage response) =>
            response.RequestMessage?.Method != HttpMethod.Post
            && response.RequestMessage?.Method != HttpMethod.Put;

        return Policy
            .HandleResult<HttpResponseMessage>(r => responseStatusCodePredicate(r) && methodPredicate(r))
            .WaitAndRetryAsync(delay);
    }
}