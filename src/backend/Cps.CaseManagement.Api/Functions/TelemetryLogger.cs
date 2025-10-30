namespace Cps.CaseManagement.Api.Functions
{
    using System.Net;
    using System.Text.Json;
    using Cps.CaseManagement.Api.Constants;
    using Cps.CaseManagement.Api.Context;
    using Cps.CaseManagement.Api.Models.Domain;
    using Cps.CaseManagement.Api.TelemetryEvents;
    using Cps.CaseManagement.Application.Telemetry;
    using Microsoft.ApplicationInsights;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.Functions.Worker;
    using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

    public class TelemetryLogger(ITelemetryClient telemetryClient)
    {
        private readonly ITelemetryClient telemetryClient = telemetryClient;

        [Function(nameof(TelemetryLogger))]
        [OpenApiOperation(operationId: nameof(TelemetryLogger), tags: ["Logging"], Description = "Logs telemetry from the UI.")]
        [OpenApiParameter(name: HttpHeaderKeys.CorrelationId, In = Microsoft.OpenApi.Models.ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Correlation identifier for tracking the request.")]
        [OpenApiRequestBody(ContentType.ApplicationJson, typeof(UiTelemetry), Description = "Body containing the telemetry data from the UI.")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.OK, Description = ApiResponseDescriptions.Success)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.BadRequest)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.Unauthorized, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Unauthorized)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.Forbidden, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Forbidden)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.InternalServerError, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.InternalServerError)]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "v1/telemetry")] HttpRequest req, FunctionContext functionContext)
        {
            var context = functionContext.GetRequestContext();

            using var reader = new StreamReader(req.Body);
            var requestJson = await reader.ReadToEndAsync();

            var uiTelemetry = JsonSerializer.Deserialize<UiTelemetry>(requestJson, GetJsonSerializerOptions());

            if (uiTelemetry == null)
            {
                return new BadRequestObjectResult("Invalid telemetry data.");
            }

            var telemetryEvent = new UiTelemetryEvent
            {
                CorrelationId = context.CorrelationId,
                EventTimestamp = uiTelemetry.EventTimestamp,
                Properties = uiTelemetry.Properties?.ToList() ?? new List<Dictionary<string, object>>()
            };
                    
            switch (uiTelemetry?.TelemetryType)
            {
                case TelemetryType.Event:
                    telemetryClient.TrackEvent(telemetryEvent);
                    break;
                case TelemetryType.Exception:
                    telemetryClient.TrackException(telemetryEvent);
                    break;
                case TelemetryType.Metric:
                    telemetryClient.TrackMetric(telemetryEvent);
                    break;
                case TelemetryType.PageView:
                    telemetryClient.TrackPageView(telemetryEvent);
                    break;
                case TelemetryType.Trace:
                    telemetryClient.TrackTrace(telemetryEvent);
                    break;
                default:
                    return new BadRequestObjectResult("Unsupported telemetry type.");
            }

            return new OkResult();
        }
        
        private JsonSerializerOptions GetJsonSerializerOptions()
        {
            return new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
        }
    }
}