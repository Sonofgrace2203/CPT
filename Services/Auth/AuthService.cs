using System.Net.Http.Json;
using CPT.Models.Auth;
using System.Text.Json;

namespace CPT.Services.Auth;

public class AuthService
{
    private readonly HttpClient _httpClient;
    private readonly BrowserStorageService _browserStorage;

    public AuthService(
    HttpClient httpClient,
    BrowserStorageService browserStorage)
    {
        _httpClient = httpClient;
        _browserStorage = browserStorage;
    }

    public async Task<(AuthResponse? Response, string? ErrorMessage)> LoginAsync(
    LoginRequest request)
    {
        var response = await _httpClient.PostAsJsonAsync(
            "api/Auth/login",
            request);

        if (!response.IsSuccessStatusCode)
        {
            string? errorMessage = null;

            try
            {
                var errorResponse =
                    await response.Content.ReadFromJsonAsync<JsonElement>();

                if (errorResponse.TryGetProperty("Message", out var message))
                {
                    errorMessage = message.GetString();
                }
            }
            catch
            {
                // Keep errorMessage null if the response
                // cannot be read.
            }

            return (null, errorMessage);
        }

        var authResponse = await response.Content
            .ReadFromJsonAsync<AuthResponse>();

        if (authResponse is null)
        {
            return (null, "Unable to process the login response.");
        }

        await _browserStorage.SetItemAsync(
            "cpt_token",
            authResponse.Token);

        await _browserStorage.SetItemAsync(
            "cpt_user",
            JsonSerializer.Serialize(authResponse.User));

        return (authResponse, null);
    }

    public async Task<bool> RegisterAsync(
        RegisterRequest request)
    {
        var response = await _httpClient.PostAsJsonAsync(
            "api/Auth/register",
            request);

        return response.IsSuccessStatusCode;
    }

    public async Task<bool> VerifyEmailAsync(
    string userId,
    string token)
    {
        var response = await _httpClient.PostAsync(
            $"api/Auth/verify-email?userId={Uri.EscapeDataString(userId)}&token={Uri.EscapeDataString(token)}",
            null);

        return response.IsSuccessStatusCode;
    }

    public async Task<bool> ForgotPasswordAsync(
    string email)
    {
        var request = new ForgotPasswordRequest
        {
            Email = email
        };

        var response = await _httpClient.PostAsJsonAsync(
            "api/Auth/forgot-password",
            request);

        return response.IsSuccessStatusCode;
    }

    public async Task<bool> ResetPasswordAsync(
        ResetPasswordRequest request)
    {
        var response = await _httpClient.PostAsJsonAsync(
            "api/Auth/reset-password",
            request);

        return response.IsSuccessStatusCode;
    }

    public async Task LogoutAsync()
    {
        await _browserStorage.RemoveItemAsync("cpt_token");
        await _browserStorage.RemoveItemAsync("cpt_user");
    }

    public async Task<string?> GetTokenAsync()
    {
        return await _browserStorage.GetItemAsync(
            "cpt_token");
    }

    public async Task<AuthUser?> GetCurrentUserAsync()
    {
        var response = await _httpClient.GetAsync(
            "api/Auth/me");

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        return await response.Content
            .ReadFromJsonAsync<AuthUser>();
    }
}