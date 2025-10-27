namespace Cps.CaseManagement.Api.Functions
{
    using System.Net;
    using Cps.CaseManagement.Api.Constants;
    using Cps.CaseManagement.Api.Context;
    using Microsoft.ApplicationInsights;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.Functions.Worker;
    using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

    public class TelemetryLogger(TelemetryClient telemetryClient)
    {
        private readonly TelemetryClient telemetryClient = telemetryClient;

        [Function(nameof(TelemetryLogger))]
        [OpenApiOperation(operationId: nameof(TelemetryLogger), tags: ["Logging"], Description = "Logs telemetry from the UI.")]
        [OpenApiParameter(name: "unitId", In = Microsoft.OpenApi.Models.ParameterLocation.Header, Required = true, Type = typeof(long), Description = "The unit Id to get courts for.")]
        [OpenApiParameter(name: HttpHeaderKeys.CorrelationId, In = Microsoft.OpenApi.Models.ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Correlation identifier for tracking the request.")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.OK, Description = ApiResponseDescriptions.Success)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.BadRequest)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.Unauthorized, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Unauthorized)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.Forbidden, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Forbidden)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.InternalServerError, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.InternalServerError)]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "v1/telemery")] HttpRequest req, FunctionContext functionContext)
        {
            var context = functionContext.GetRequestContext();

            

            return new OkResult();
        }
    }
}