using System.Net.Http.Json;
using CPT.Models.UserSettings;

namespace CPT.Services;

public class UserSettingsApiService
{
    private readonly HttpClient _httpClient;

    public UserSettingsApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<UserSettingsDto?> GetAsync()
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<UserSettingsDto>(
                "api/UserSettings");
        }
        catch
        {
            return null;
        }
    }

    public async Task<UserSettingsDto?> UpdateAsync(
    UserSettingsDto settings)
    {
        try
        {
            var response = await _httpClient.PutAsJsonAsync(
                "api/UserSettings",
                settings);

            if (!response.IsSuccessStatusCode)
                return null;

            return await response.Content
                .ReadFromJsonAsync<UserSettingsDto>();
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> ShouldConfirmBeforeDeleteAsync()
    {
        var settings = await GetAsync();

        return settings?.ConfirmBeforeDelete ?? true;
    }
}