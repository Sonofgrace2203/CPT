using System.Net.Http.Json;
using cpt.Models.Modules;

namespace CPT.Services;

public class PhysicsModuleApiService
{
    private readonly HttpClient _httpClient;

    public PhysicsModuleApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<PhysicsModuleDto>> GetAllAsync()
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<List<PhysicsModuleDto>>(
                "api/PhysicsModules") ?? new List<PhysicsModuleDto>();
        }
        catch
        {
            return new List<PhysicsModuleDto>();
        }
    }
}

public class PhysicsModuleDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public bool IsActive { get; set; }
}