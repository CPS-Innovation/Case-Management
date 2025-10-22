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
        this.RuleForEach(x => x.Defendants).SetValidator(new CaseRegistrationDefendantValidator());
        this.RuleFor(x => x.MonitoringCodes).NotEmpty();
        this.RuleForEach(x => x.MonitoringCodes).SetValidator(new CaseRegistrationMonitoringCodeValidator());
    }
}