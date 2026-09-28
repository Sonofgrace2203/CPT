using System.Net.Http.Json;
using cpt.Models.Simulations;

namespace CPT.Services;

public class SimulationApiService
{
    private readonly HttpClient _httpClient;

    public SimulationApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<SimulationDto>> GetAllAsync()
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<List<SimulationDto>>(
                "api/Simulations") ?? new List<SimulationDto>();
        }
        catch
        {
            return new List<SimulationDto>();
        }
    }

    public async Task<List<SimulationDto>> GetDemoHistoryAsync()
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<List<SimulationDto>>(
                "api/Simulations/demo-history") ?? new List<SimulationDto>();
        }
        catch
        {
            return new List<SimulationDto>();
        }
    }

    public async Task<bool> DeleteDemoAsync(Guid id)
    {
        try
        {
            var response = await _httpClient.DeleteAsync(
                $"api/Simulations/demo-history/{id}");

            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> DeleteManyDemoAsync(
        IEnumerable<Guid> ids)
    {
        try
        {
            var request = new HttpRequestMessage(
                HttpMethod.Delete,
                "api/Simulations/demo-history/bulk")
            {
                Content = JsonContent.Create(
                    new
                    {
                        ids = ids.ToList()
                    })
            };

            var response = await _httpClient.SendAsync(request);

            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    public async Task<SimulationDto?> GetByIdAsync(Guid id)
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<SimulationDto>(
                $"api/Simulations/{id}");
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        try
        {
            var response = await _httpClient.DeleteAsync(
                $"api/Simulations/{id}");

            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> DeleteManyAsync(IEnumerable<Guid> ids)
    {
        try
        {
            var request = new HttpRequestMessage(
                HttpMethod.Delete,
                "api/Simulations/bulk")
            {
                Content = JsonContent.Create(
                    new
                    {
                        ids = ids.ToList()
                    })
            };

            var response = await _httpClient.SendAsync(request);

            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> SetFavouriteAsync(
    Guid id,
    bool isFavourite)
    {
        try
        {
            var response = await _httpClient.PutAsJsonAsync(
                $"api/Simulations/{id}/favourite",
                isFavourite);

            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }
}