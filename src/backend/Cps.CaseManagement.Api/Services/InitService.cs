
using Cps.CaseManagement.Api.Models.Response;
using Cps.CaseManagement.MdsClient.Client;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Cps.CaseManagement.Api.Services;

public class InitService(ILogger<InitService> logger, IConfiguration configuration, IMdsClient mdsClient, IMdsArgFactory mdsArgFactory) : IInitService
{
    private readonly ILogger<InitService> _logger = logger;
    private readonly IConfiguration _configuration = configuration;
    private readonly IMdsClient _mdsClient = mdsClient;
    private readonly IMdsArgFactory _mdsArgFactory = mdsArgFactory;

    public async Task<InitResult> ProcessRequest(HttpRequest req, Guid correlationId, string? cc)
    {
        var redirectUrlCwa = _configuration["RedirectUrl:CaseworkApp"] ?? string.Empty;
        var redirectUrlCaseManagement = _configuration["RedirectUrl:CaseManagementUi"] ?? string.Empty;

        if (string.IsNullOrEmpty(redirectUrlCwa) || string.IsNullOrEmpty(redirectUrlCaseManagement))
        {
            _logger.LogError("One or more redirect URL's are missing.");
            return new InitResult
            {
                Status = InitResultStatus.ServerError,
                Message = "One or more redirect URL's are missing"
            };
        }

        // set cookies if cc is present
        if (!string.IsNullOrEmpty(cc))
        {
            string? ct = null;

            try
            {
                var fullCmsAuthValues = new AuthenticationContext(cc, Guid.NewGuid().ToString(), DateTime.UtcNow.AddHours(1)).ToString();
                ct = await _mdsClient.GetCmsModernTokenAsync(_mdsArgFactory.CreateBaseArg(fullCmsAuthValues, correlationId));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get ct from mds GetCmsModernTokenAsync");
            }

            _logger.LogInformation("Redirecting to {RedirectUrlCaseManagement} with correlationId {CorrelationId}", redirectUrlCaseManagement, correlationId);

            return new InitResult
            {
                Status = InitResultStatus.Redirect,
                RedirectUrl = redirectUrlCaseManagement,
                ShouldSetCookie = true,
                Cc = cc,
                Ct = ct
            };
        }

        // redirect to CWA handoff endpoint if cc is missing
        _logger.LogInformation("Redirecting to {RedirectUrlCwa} with correlationId {CorrelationId}", redirectUrlCwa, correlationId);

        return new InitResult
        {
            Status = InitResultStatus.Redirect,
            RedirectUrl = BuildRedirectUrl(req, redirectUrlCwa),
        };
    }

    internal string BuildRedirectUrl(HttpRequest req, string redirectUrlCwa)
    {
        string host = $"{req.Scheme}://{req.Host}";

        string redirectEndpoint = "/api/v1/init";

        string redirectUrl = $"{redirectUrlCwa}{host}{redirectEndpoint}";

        _logger.LogInformation("Built redirect URL: {RedirectUrl}", redirectUrl);

        return redirectUrl;
    }
}