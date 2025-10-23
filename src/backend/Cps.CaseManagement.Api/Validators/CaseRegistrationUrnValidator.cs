namespace Cps.CaseManagement.Api.Validators;

using System.Text.RegularExpressions;
using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation;

public class CaseRegistrationUrnValidator : AbstractValidator<CaseRegistrationUrn>
{
    // Domain: two digits (00–99). We allow optional surrounding whitespace to be forgiving on input binding.
    private static readonly Regex TwoDigits = new(@"^\s*\d{2}\s*$", RegexOptions.Compiled);

    // Domain: two alphanumeric (A–Z/0–9). Case-insensitive to accept 'el' or 'EL'; we typically store uppercase.
    private static readonly Regex TwoAlnum = new(@"^\s*[A-Z0-9]{2}\s*$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

    // Domain: five digits (00000–99999).
    private static readonly Regex FiveDigits = new(@"^\s*\d{5}\s*$", RegexOptions.Compiled);

    /// <summary>
    /// URN has 4 sections:
    ///  1) PoliceForce: 2 digits (00-99)
    ///  2) PoliceUnit:  2 alphanumeric (A–Z, 0–9)
    ///  3) UniqueRef:   5 digits (00000–99999)
    ///  4) Year:        2-digit year (00–99) — UI/handler should default to current year (yy)
    /// This validator enforces the shape; defaulting is handled outside to avoid side effects.
    /// </summary>
    public CaseRegistrationUrnValidator()
    {
        // SECTION 1: PoliceForce (two digits)
        // Domain intent: code supplied by police; must be numeric and exactly 2 characters (e.g., "00", "45", "99").
        RuleFor(x => x.PoliceForce)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("PoliceForce is required.")                  // cannot be null/empty
            .Must(v => v is not null && TwoDigits.IsMatch(v))                    // must match ^\d{2}$
                .WithMessage("PoliceForce must be exactly 2 digits (00-99).");

        // SECTION 2: PoliceUnit (two alphanumeric)
        // Domain intent: unit code; letters or digits; exactly 2 chars (e.g., "EL", "Z9", "A1").
        RuleFor(x => x.PoliceUnit)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("PoliceUnit is required.")
            .Must(v => v is not null && TwoAlnum.IsMatch(v))
                .WithMessage("PoliceUnit must be exactly 2 alphanumeric characters (A-Z, 0-9).");

        // SECTION 3: UniqueRef (five digits)
        // Domain intent: free text input limited to digits for consistency; exactly 5 digits.
        RuleFor(x => x.UniqueRef)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("UniqueRef is required.")
            .Must(v => v is not null && FiveDigits.IsMatch(v))
                .WithMessage("UniqueRef must be exactly 5 digits (00000-99999).");

        // SECTION 4: Year (two-digit year)
        // Domain intent: 2-digit registration year; UI/handler should default to current yy (e.g., 25 for 2025).
        // Validator only enforces the 0–99 range; business windows (e.g., 25–50) can be added if required.
        RuleFor(x => x.Year)
            .InclusiveBetween(0, 99)
            .WithMessage("Year must be a 2-digit value between 00 and 99.");
    }
}
