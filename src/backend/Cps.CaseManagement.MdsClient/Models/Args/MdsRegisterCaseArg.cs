namespace Cps.CaseManagement.MdsClient.Models.Args;

using Cps.CaseManagement.MdsClient.Models.Entities;

public class MdsRegisterCaseArg : MdsBaseArgDto
{
    public required CaseRegistrationRequest CaseDetails { get; set; }
}