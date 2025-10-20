namespace Cps.CaseManagement.Api.Functions;

using System.Net;
using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Context;
using Cps.CaseManagement.Api.Services;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;

public class ListWMSUnits(ILogger<ListWMSUnits> logger,
  IMdsService mdsService,
  IMdsArgFactory mdsArgFactory)
{
  private readonly ILogger<ListWMSUnits> _logger = logger;
  private readonly IMdsService _mdsService = mdsService;
  private readonly IMdsArgFactory _mdsArgFactory = mdsArgFactory;

  [Function(nameof(ListWMSUnits))]
  [OpenApiOperation(operationId: nameof(ListWMSUnits), tags: ["MDS"], Description = "Gets the list of WMS units from CMS.")]
  [OpenApiParameter(name: HttpHeaderKeys.CorrelationId, In = Microsoft.OpenApi.Models.ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Correlation identifier for tracking the request.")]
  [OpenApiParameter(name: HttpHeaderKeys.CmsAuthValues, In = Microsoft.OpenApi.Models.ParameterLocation.Header, Required = true, Type = typeof(string), Description = "CmsAuthValues to authenticate to CMS.")]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: ContentType.ApplicationJson, bodyType: typeof(WMSUnitEntity[]), Description = ApiResponseDescriptions.Success)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.BadRequest)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.Unauthorized, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Unauthorized)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.Forbidden, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Forbidden)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.InternalServerError, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.InternalServerError)]
  public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/wms-units")] HttpRequest req, FunctionContext functionContext)
  {
    var context = functionContext.GetRequestContext();

    var result = await _mdsService.GetWMSUnitsAsync(_mdsArgFactory.CreateBaseArg(context.CmsAuthValues, context.CorrelationId));

    return new OkObjectResult(result);
  }
}