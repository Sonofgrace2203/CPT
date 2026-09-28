using System.Net.Http.Headers;

namespace CPT.Services.Auth;

public class JwtAuthorizationHandler : DelegatingHandler
{
    private readonly BrowserStorageService _browserStorage;

    public JwtAuthorizationHandler(
        BrowserStorageService browserStorage)
    {
        _browserStorage = browserStorage;
    }

    protected override async Task<HttpResponseMessage> SendAsync(
    HttpRequestMessage request,
    CancellationToken cancellationToken)
    {
        var token =
            await _browserStorage.GetItemAsync("cpt_token");

        if (!string.IsNullOrWhiteSpace(token))
        {
            request.Headers.Authorization =
                new AuthenticationHeaderValue(
                    "Bearer",
                    token);
        }

        var response =
            await base.SendAsync(
                request,
                cancellationToken);

        if (response.StatusCode ==
            System.Net.HttpStatusCode.Unauthorized)
        {
            await _browserStorage.RemoveItemAsync(
                "cpt_token");

            await _browserStorage.RemoveItemAsync(
                "cpt_user");
        }

        return response;
    }
}