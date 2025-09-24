namespace Cps.CaseManagement.Api.Validators;

public class ValidateTokenResult
{
    public bool IsValid { get; set; }
    public string? Username { get; set; }
    public string? Token { get; set; }
}