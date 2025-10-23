namespace Cps.CaseManagement.MdsClient.Factories;

using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.MdsClient.Models.Entities;
using Cps.CaseManagement.MdsClient.Models.Enums;

public class MdsArgFactory : IMdsArgFactory
{
    public MdsBaseArgDto CreateBaseArg(string cmsAuthValues, Guid correlationId)
    {
        return new MdsBaseArgDto
        {
            CmsAuthValues = cmsAuthValues,
            CorrelationId = correlationId
        };
    }

    public MdsUnitIdArg CreateGetByUnitIdArg(string cmsAuthValues, Guid correlationId, long unitId)
    {
        return new MdsUnitIdArg
        {
            CmsAuthValues = cmsAuthValues,
            CorrelationId = correlationId,
            UnitId = unitId
        };
    }

    public MdsUrnArg CreateGetByUrnArg(string cmsAuthValues, Guid correlationId, string urn)
    {
        return new MdsUrnArg
        {
            CmsAuthValues = cmsAuthValues,
            CorrelationId = correlationId,
            Urn = urn
        };
    }

    public MdsRegisterCaseArg CreateRegisterCaseArg(string cmsAuthValues, Guid correlationId, CaseRegistrationRequest caseDetails)
    {
        return new MdsRegisterCaseArg
        {
            CmsAuthValues = cmsAuthValues,
            CorrelationId = correlationId,
            CaseDetails = caseDetails
        };
    }

    public MdsOffenceSearchArg CreateOffenceSearchArg(
        string cmsAuthValues,
        Guid correlationId,
        string? code = null,
        string? legislation = null,
        bool legislationPartialSearch = false,
        string? description = null,
        bool descriptionPartialSearch = false,
        string[]? keywords = null,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        int? page = null,
        int? itemsPerPage = null,
        OffenceSearchResultOrder? order = null,
        bool isAscending = false,
        string? multisearch = null,
        bool multisearchPartialSearch = false
    )
    {
        return new MdsOffenceSearchArg
        {
            CmsAuthValues = cmsAuthValues,
            CorrelationId = correlationId,
            Code = code,
            Legislation = legislation,
            LegislationPartialSearch = legislationPartialSearch,
            Description = description,
            DescriptionPartialSearch = descriptionPartialSearch,
            Keywords = keywords,
            FromDate = fromDate,
            ToDate = toDate,
            Page = page,
            ItemsPerPage = itemsPerPage,
            Order = order,
            IsAscending = isAscending,
            Multisearch = multisearch,
            MultisearchPartialSearch = multisearchPartialSearch
        };
    }
}