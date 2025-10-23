namespace Cps.CaseManagement.Api.Helpers;

using Cps.CaseManagement.Domain.Models;
using FluentValidation;
using Microsoft.AspNetCore.Http;

public interface IRequestValidator
{
    Task<ValidatableRequest<T>> GetJsonBody<T, V>(HttpRequest request)
      where V : AbstractValidator<T>, new();
}