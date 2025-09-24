namespace Cps.CaseManagement.Api.Tests.Helpers;

using Cps.CaseManagement.Api.Context;
using Microsoft.Azure.Functions.Worker;

public static class FunctionContextStubHelper
{
    public static FunctionContext CreateFunctionContextStub(Guid correlationId, string cmsAuthValues, string username)
    {
        var functionContext = new TestFunctionContext();
        var requestContext = new RequestContext(correlationId, cmsAuthValues, username);

        // Store the request context in Items dictionary (this is how the extension method retrieves it)
        functionContext.Items["RequestContext"] = requestContext;

        return functionContext;
    }
}
