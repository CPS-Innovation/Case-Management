namespace Cps.CaseManagement.Api.Tests.Unit.Validators;

using Cps.CaseManagement.Api.Validators;
using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation.TestHelper;

public class CaseRegistrationRequestValidatorTests
{
    private readonly CaseRegistrationRequestValidator _validator = new();

    private CaseRegistrationRequest GetValidRequest()
    {
        return new CaseRegistrationRequest
        {
            Urn = new CaseRegistrationUrn
            {
                UniqueRef = "12345",
                Year = 30,
                PoliceForce = "AA",
                PoliceUnit = "BB"
            },
            RegisteringAreaId = 1,
            RegisteringUnitId = 2,
            Defendants = new List<CaseRegistrationDefendant>
            {
                new CaseRegistrationDefendant
                {
                    Surname = "Smith",
                    Charges = new List<CaseRegistrationCharge>
                    {
                        new CaseRegistrationCharge
                        {
                            OffenceCode = "CODE1",
                            OffenceDescription = "Description",
                            OffenceId = "ID1",
                            DateFrom = DateTime.Today,
                            Comment = "Comment"
                        }
                    }
                }
            },
            MonitoringCodes = new List<CaseRegistrationMonitoringCode>
            {
                new CaseRegistrationMonitoringCode("MON1", true)
            }
        };
    }

    [Fact]
    public void Valid_Request_ShouldPass()
    {
        var result = _validator.TestValidate(GetValidRequest());
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Missing_Urn_ShouldFail()
    {
        var req = GetValidRequest();
        req.Urn = null!;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor(x => x.Urn);
    }

    [Fact]
    public void RegisteringAreaId_Zero_ShouldFail()
    {
        var req = GetValidRequest();
        req.RegisteringAreaId = 0;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor(x => x.RegisteringAreaId);
    }

    [Fact]
    public void RegisteringUnitId_Zero_ShouldFail()
    {
        var req = GetValidRequest();
        req.RegisteringUnitId = 0;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor(x => x.RegisteringUnitId);
    }

    [Fact]
    public void Defendants_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        req.Defendants = new List<CaseRegistrationDefendant>();
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor(x => x.Defendants);
    }

    [Fact]
    public void MonitoringCodes_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        req.MonitoringCodes = new List<CaseRegistrationMonitoringCode>();
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor(x => x.MonitoringCodes);
    }

    [Fact]
    public void Defendant_Surname_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            defendants[0].Surname = "";
            req.Defendants = defendants;
        }
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Surname");
    }

    [Fact]
    public void Defendant_Charges_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            defendants[0].Charges = [];
            req.Defendants = defendants;
        }
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Charges");
    }

    [Fact]
    public void Charge_OffenceCode_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            var charges = defendants[0].Charges?.ToList();
            if (charges != null && charges.Count > 0)
            {
                charges[0].OffenceCode = "";
                defendants[0].Charges = charges;
                req.Defendants = defendants;
            }
        }
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Charges[0].OffenceCode");
    }

    [Fact]
    public void Charge_OffenceDescription_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            var charges = defendants[0].Charges?.ToList();
            if (charges != null && charges.Count > 0)
            {
                charges[0].OffenceDescription = "";
                defendants[0].Charges = charges;
                req.Defendants = defendants;
            }
        }
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Charges[0].OffenceDescription");
    }

    [Fact]
    public void Charge_OffenceId_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            var charges = defendants[0].Charges?.ToList();
            if (charges != null && charges.Count > 0)
            {
                charges[0].OffenceId = "";
                defendants[0].Charges = charges;
                req.Defendants = defendants;
            }
        }
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Charges[0].OffenceId");
    }

    [Fact]
    public void Charge_DateFrom_Future_ShouldFail()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            var charges = defendants[0].Charges?.ToList();
            if (charges != null && charges.Count > 0)
            {
                charges[0].DateFrom = DateTime.Today.AddDays(1);
                defendants[0].Charges = charges;
                req.Defendants = defendants;
            }
        }
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Charges[0].DateFrom");
    }

    [Fact]
    public void MonitoringCode_Code_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        if (req.MonitoringCodes != null && req.MonitoringCodes.Count > 0)
        {
            var codes = req.MonitoringCodes.ToList();
            codes[0] = new CaseRegistrationMonitoringCode("", true);
            req.MonitoringCodes = codes;
        }
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("MonitoringCodes[0].Code");
    }

    [Fact]
    public void Urn_UniqueRef_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        req.Urn.UniqueRef = "";
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Urn.UniqueRef");
    }

    [Fact]
    public void Urn_Year_OutOfRange_ShouldFail()
    {
        var req = GetValidRequest();
        req.Urn.Year = 24;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Urn.Year");
    }

    [Fact]
    public void Urn_PoliceForce_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        req.Urn.PoliceForce = "";
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Urn.PoliceForce");
    }

    [Fact]
    public void Urn_PoliceUnit_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        req.Urn.PoliceUnit = "";
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Urn.PoliceUnit");
    }
}