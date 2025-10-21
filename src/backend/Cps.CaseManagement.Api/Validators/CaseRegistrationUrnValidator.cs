namespace Cps.CaseManagement.Api.Validators;

using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation;

public class CaseRegistrationUrnValidator : AbstractValidator<CaseRegistrationUrn>
{
    public CaseRegistrationUrnValidator()
    {
        this.RuleFor(x => x.UniqueRef).NotEmpty().MaximumLength(5);
        this.RuleFor(x => x.Year).InclusiveBetween(25, 50);
        this.RuleFor(x => x.PoliceForce).NotEmpty().MaximumLength(2);
        this.RuleFor(x => x.PoliceUnit).NotEmpty().MaximumLength(2);
    }
}