
using System.Net.Http.Json;
using CPT.Models.UserSettings;

namespace CPT.Services;

public class WaveEquationSettingsApiService
{
    private readonly HttpClient _httpClient;

    public WaveEquationSettingsApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<WaveEquationSettingsDto?> GetAsync()
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<WaveEquationSettingsDto>(
                "api/WaveEquationSettings");
        }
        catch
        {
            return null;
        }
    }

    public async Task<WaveEquationSettingsDto?> UpdateAsync(
        WaveEquationSettingsDto settings)
    {
        try
        {
            var response = await _httpClient.PutAsJsonAsync(
                "api/WaveEquationSettings",
                settings);

            if (!response.IsSuccessStatusCode)
                return null;

            return await response.Content
                .ReadFromJsonAsync<WaveEquationSettingsDto>();
        }
        catch
        {
            return null;
        }
    }
}
