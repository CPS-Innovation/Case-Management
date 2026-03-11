namespace Cps.CaseManagement.Api.Validators;

using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation;

public class CaseRegistrationDefendantValidator : AbstractValidator<CaseRegistrationDefendant>
{
    public CaseRegistrationDefendantValidator()
    {
        this.RuleFor(x => x.Surname).NotEmpty().MaximumLength(35);
        this.RuleFor(x => x.Charges).NotEmpty().When(x => !x.IsNotYetCharged);
        this.RuleForEach(x => x.Charges).SetValidator(new CaseRegistrationChargeValidator());
    }
}