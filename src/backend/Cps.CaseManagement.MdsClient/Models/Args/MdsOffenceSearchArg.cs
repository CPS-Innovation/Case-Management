namespace Cps.CaseManagement.MdsClient.Models.Args;

using Cps.CaseManagement.MdsClient.Models.Enums;

public class MdsOffenceSearchArg : MdsBaseArgDto
{
    public string? Code { get; set; }
    public string? Legislation { get; set; }
    public bool? LegislationPartialSearch { get; set; } = false;
    public string? Description { get; set; }
    public bool? DescriptionPartialSearch { get; set; } = false;
    public string[]? Keywords { get; set; }
    public DateOnly? FromDate { get; set; }
    public DateOnly? ToDate { get; set; }
    public int? Page { get; set; }
    public int? ItemsPerPage { get; set; }
    public OffenceSearchResultOrder? Order { get; set; }
    public bool? IsAscending { get; set; } = false;
    public string? Multisearch { get; set; }
    public bool? MultisearchPartialSearch { get; set; } = false;
}