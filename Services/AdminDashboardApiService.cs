using System.Net.Http.Json;
using CPT.Models.Admin;

namespace CPT.Services;

public class AdminDashboardApiService
{
    private readonly HttpClient _httpClient;

    public AdminDashboardApiService(
        HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<AdminDashboardDto?> GetDashboardAsync()
    {
        var response =
            await _httpClient.GetAsync(
                "api/AdminDashboard");

        if (!response.IsSuccessStatusCode)
        {
            var error =
                await response.Content.ReadAsStringAsync();

            Console.WriteLine(
                $"GET ADMIN DASHBOARD FAILED: " +
                $"{(int)response.StatusCode} " +
                $"{response.StatusCode}");

            Console.WriteLine(
                $"GET ADMIN DASHBOARD ERROR: {error}");

            return null;
        }

        return await response.Content
            .ReadFromJsonAsync<AdminDashboardDto>();
    }
}