using System.Net.Http.Json;
using cpt.Models.Dashboard;

namespace CPT.Services;

public class DashboardApiService
{
    private readonly HttpClient _httpClient;

    public DashboardApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<DashboardDto?> GetDashboardAsync()
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<DashboardDto>(
                "api/Dashboard");
        }
        catch
        {
            return null;
        }
    }
}