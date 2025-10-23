namespace Cps.CaseManagement.Api.Validators;

using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation;

public class CaseRegistrationChargeValidator : AbstractValidator<CaseRegistrationCharge>
{
    public CaseRegistrationChargeValidator()
    {
        this.RuleFor(x => x.OffenceCode).NotEmpty().MaximumLength(10);
        this.RuleFor(x => x.OffenceDescription).NotEmpty().MaximumLength(255);
        this.RuleFor(x => x.OffenceId).NotEmpty().MaximumLength(10);
        this.RuleFor(x => x.DateFrom).NotNull().LessThanOrEqualTo(DateTime.Today);
        this.RuleFor(x => x.Comment).MaximumLength(255);
    }
}