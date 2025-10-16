namespace Cps.CaseManagement.Api.Functions;

using System.Net;
using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Context;
using Cps.CaseManagement.MdsClient.Client;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;

public class GetCourts(ILogger<GetCourts> logger,
  IMdsClient mdsClient,
  IMdsArgFactory mdsArgFactory)
{
  private readonly ILogger<GetCourts> _logger = logger;
  private readonly IMdsClient _mdsClient = mdsClient;
  private readonly IMdsArgFactory _mdsArgFactory = mdsArgFactory;

  [Function(nameof(GetCourts))]
  [OpenApiOperation(operationId: nameof(GetCourts), tags: ["MDS"], Description = "Gets courts by unit Id.")]
  [OpenApiParameter(name: "unitId", In = Microsoft.OpenApi.Models.ParameterLocation.Path, Required = true, Type = typeof(long), Description = "The unit Id to get courts for.")]
  [OpenApiParameter(name: HttpHeaderKeys.CorrelationId, In = Microsoft.OpenApi.Models.ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Correlation identifier for tracking the request.")]
  [OpenApiParameter(name: HttpHeaderKeys.CmsAuthValues, In = Microsoft.OpenApi.Models.ParameterLocation.Header, Required = true, Type = typeof(string), Description = "CmsAuthValues to authenticate to CMS.")]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: ContentType.ApplicationJson, bodyType: typeof(CourtEntity[]), Description = ApiResponseDescriptions.Success)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.BadRequest)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.Unauthorized, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Unauthorized)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.Forbidden, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Forbidden)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.InternalServerError, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.InternalServerError)]
  public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/courts/{unitId}")] HttpRequest req, FunctionContext functionContext, long unitId)
  {
    var context = functionContext.GetRequestContext();

    var arg = _mdsArgFactory.CreateGetByUnitIdArg(context.CmsAuthValues, context.CorrelationId, unitId);

    var result = await _mdsClient.GetCourtsAsync(arg);

    return new OkObjectResult(result);
  }
}