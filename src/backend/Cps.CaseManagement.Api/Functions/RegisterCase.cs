namespace Cps.CaseManagement.Api.Functions;

using System.Net;
using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Context;
using Cps.CaseManagement.Api.Helpers;
using Cps.CaseManagement.Api.Validators;
using Cps.CaseManagement.MdsClient.Client;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Entities;
using CPS.CaseManagement.MdsClient.Models.Dto;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;

public class RegisterCase(ILogger<RegisterCase> logger, IMdsClient mdsClient, IMdsArgFactory mdsArgFactory, IRequestValidator requestValidator)
{
    private readonly ILogger<RegisterCase> _logger = logger;
    private readonly IMdsClient _mdsClient = mdsClient;
    private readonly IMdsArgFactory _mdsArgFactory = mdsArgFactory;
    private readonly IRequestValidator _requestValidator = requestValidator;

    [Function(nameof(RegisterCase))]
    [OpenApiOperation(operationId: nameof(RegisterCase), tags: ["MDS"], Description = "Registers a case in CMS.")]
    [OpenApiParameter(name: HttpHeaderKeys.CorrelationId, In = Microsoft.OpenApi.Models.ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Correlation identifier for tracking the request.")]
    [OpenApiParameter(name: HttpHeaderKeys.CmsAuthValues, In = Microsoft.OpenApi.Models.ParameterLocation.Cookie, Required = true, Type = typeof(string), Description = "CmsAuthValues to authenticate to CMS.")]
    [OpenApiRequestBody(ContentType.ApplicationJson, typeof(CaseRegistrationRequest), Description = "Body containing the NetApp connection to create")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: ContentType.ApplicationJson, bodyType: typeof(CaseRegistrationResponseDto), Description = ApiResponseDescriptions.Success)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.BadRequest)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.Unauthorized, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Unauthorized)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.Forbidden, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Forbidden)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.InternalServerError, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.InternalServerError)]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "v1/cases")] HttpRequest req, FunctionContext functionContext)
    {
        var context = functionContext.GetRequestContext();

        var caseRegistrationRequest = await _requestValidator.GetJsonBody<CaseRegistrationRequest, CaseRegistrationRequestValidator>(req);

        if (!caseRegistrationRequest.IsValid)
        {
            _logger.LogWarning("Case registration request is invalid. CorrelationId: {CorrelationId}. Errors: {ValidationErrors}", context.CorrelationId, caseRegistrationRequest.ValidationErrors);
            return new BadRequestObjectResult(caseRegistrationRequest.ValidationErrors);
        }

        try
        {
            var result = await _mdsClient.RegisterCaseAsync(
            _mdsArgFactory.CreateRegisterCaseArg(
                context.CmsAuthValues,
                context.CorrelationId,
                caseRegistrationRequest.Value));

            return new OkObjectResult(result);
        }
        catch (Exception ex)
        {
            _logger.LogError("Case registration failed. CorrelationId: {CorrelationId}, Error: {Message}", context.CorrelationId, ex.Message);
            return new BadRequestObjectResult($"Case registration failed. Error: {ex.Message}");
        }
    }
}