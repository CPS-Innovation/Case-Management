using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Extensions.Logging;
using Cps.CaseManagement.Api.Context;
using Cps.CaseManagement.Api.Exceptions;
using Cps.CaseManagement.Api.Extensions;
using Cps.CaseManagement.MdsClient.Exceptions;

namespace Cps.CaseManagement.Api.Middleware;

public class ExceptionHandlingMiddleware : IFunctionsWorkerMiddleware
{
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(ILogger<ExceptionHandlingMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            var statusCode = exception switch
            {
                ArgumentNullException or BadRequestException _ => HttpStatusCode.BadRequest,
                CmsUnauthorizedException or CpsAuthenticationException _ => HttpStatusCode.Unauthorized,
                MdsClientException mds => mds.StatusCode,
                _ => HttpStatusCode.InternalServerError,
            };

            var message = string.Empty;

            var httpRequestData = await context.GetHttpRequestDataAsync();

            if (httpRequestData != null)
            {
                var correlationId = Guid.NewGuid();
                try
                {
                    correlationId = context.GetRequestContext().CorrelationId;
                }
                catch
                {
                    _logger.LogTrace("Using fallback CorrelationId: {CorrelationId}", correlationId);
                }

                _logger.LogMethodError(correlationId, httpRequestData.Url.ToString(), message, exception);

                var response = httpRequestData.CreateResponse(statusCode);
                await response.WriteAsJsonAsync(new
                {
                    ErrorMessage = "An unexpected error occurred. Please contact support with the CorrelationId.",
                    CorrelationId = correlationId
                });

                var invocationResult = context.GetInvocationResult();

                var httpOutputBindingFromMultipleOutputBindings = GetHttpOutputBindingFromMultipleOutputBinding(context);

                if (httpOutputBindingFromMultipleOutputBindings is not null)
                {
                    httpOutputBindingFromMultipleOutputBindings.Value = response;
                }
                else
                {
                    invocationResult.Value = response;
                }
            }
        }
    }

    private static OutputBindingData<HttpResponseData>? GetHttpOutputBindingFromMultipleOutputBinding(FunctionContext context)
    {
        // The output binding entry name will be "$return" only when the function return type is HttpResponseData
        return context.GetOutputBindings<HttpResponseData>()
            .FirstOrDefault(b => b.BindingType == "http" && b.Name != "$return");
    }
}