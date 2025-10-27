namespace Cps.CaseManagement.MdsClient.Factories;

using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.MdsClient.Models.Entities;
using Cps.CaseManagement.MdsClient.Models.Enums;

public interface IMdsArgFactory
{
    MdsBaseArgDto CreateBaseArg(string cmsAuthValues, Guid correlationId);
    MdsUnitIdArg CreateGetByUnitIdArg(string cmsAuthValues, Guid correlationId, long unitId);
    MdsUrnArg CreateGetByUrnArg(string cmsAuthValues, Guid correlationId, string urn);
    MdsRegisterCaseArg CreateRegisterCaseArg(string cmsAuthValues, Guid correlationId, CaseRegistrationRequest caseDetails);
    MdsOffenceSearchArg CreateOffenceSearchArg(
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
    );
}