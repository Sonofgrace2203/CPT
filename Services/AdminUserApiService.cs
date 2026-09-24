using System.Net.Http.Json;
using CPT.Models.Admin;

namespace CPT.Services;

public class AdminUserApiService
{
    private readonly HttpClient _httpClient;

    public AdminUserApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<CptUserDto>> GetUsersAsync()
    {
        var response = await _httpClient.GetAsync(
            "api/AdminUsers");

        if (!response.IsSuccessStatusCode)
        {
            var error =
                await response.Content.ReadAsStringAsync();

            Console.WriteLine(
                $"GET USERS FAILED: {(int)response.StatusCode} {response.StatusCode}");

            Console.WriteLine(
                $"GET USERS ERROR: {error}");

            return new List<CptUserDto>();
        }

        return await response.Content
            .ReadFromJsonAsync<List<CptUserDto>>()
            ?? new List<CptUserDto>();
    }

    public async Task<bool> UpdateUserRoleAsync(
    Guid userId,
    string role)
    {
        var response =
            await _httpClient.PutAsJsonAsync(
                $"api/AdminUsers/{userId}/role",
                new
                {
                    Role = role
                });

        if (!response.IsSuccessStatusCode)
        {
            var error =
                await response.Content.ReadAsStringAsync();

            Console.WriteLine(
                $"UPDATE USER ROLE FAILED: " +
                $"{(int)response.StatusCode} " +
                $"{response.StatusCode}");

            Console.WriteLine(
                $"UPDATE USER ROLE ERROR: {error}");

            return false;
        }

        return true;
    }
}