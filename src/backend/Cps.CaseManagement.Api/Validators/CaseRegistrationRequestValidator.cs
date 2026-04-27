namespace Cps.CaseManagement.Api.Validators;

using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation;

public class CaseRegistrationRequestValidator : AbstractValidator<CaseRegistrationRequest>
{
    public CaseRegistrationRequestValidator()
    {
        this.RuleFor(x => x.Urn).NotNull().SetValidator(new CaseRegistrationUrnValidator());
        this.RuleFor(x => x.RegisteringAreaId).NotEmpty().GreaterThan(0);
        this.RuleFor(x => x.RegisteringUnitId).NotEmpty().GreaterThan(0);
        this.RuleFor(x => x.MonitoringCodes)
            .Must(codes => codes != null && codes.Any(c => c.Code == "CSEA" && c.Selected))
            .When(x => x.Defendants == null || x.Defendants.Count == 0 || x.Defendants.Any(d => d.Charges == null || d.Charges.Count == 0))
            .WithMessage("The 'Pre-Charge Decision' monitoring code must be selected when there are defendants who are not yet charged or have no charges.");
        this.RuleForEach(x => x.Defendants).SetValidator(new CaseRegistrationDefendantValidator());
        this.RuleForEach(x => x.MonitoringCodes).SetValidator(new CaseRegistrationMonitoringCodeValidator());
    }
}