namespace Cps.CaseManagement.Api.Services;

using Cps.CaseManagement.Api.Models.Response;
using Microsoft.AspNetCore.Http;

public interface IInitService
{
    Task<InitResult> ProcessRequest(HttpRequest req, Guid correlationId, string? cc);
}