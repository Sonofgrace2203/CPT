
using System.Net.Http.Json;
using CPT.Models.UserSettings;

namespace CPT.Services;

public class HeatEquationSettingsApiService
{
    private readonly HttpClient _httpClient;

    public HeatEquationSettingsApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<HeatEquationSettingsDto?> GetAsync()
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<HeatEquationSettingsDto>(
                "api/HeatEquationSettings");
        }
        catch
        {
            return null;
        }
    }

    public async Task<HeatEquationSettingsDto?> UpdateAsync(
        HeatEquationSettingsDto settings)
    {
        try
        {
            var response = await _httpClient.PutAsJsonAsync(
                "api/HeatEquationSettings",
                settings);

            if (!response.IsSuccessStatusCode)
                return null;

            return await response.Content
                .ReadFromJsonAsync<HeatEquationSettingsDto>();
        }
        catch
        {
            return null;
        }
    }
}
