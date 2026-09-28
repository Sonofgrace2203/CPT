using System.Net.Http.Json;
using System.Globalization;
using CPT.Models.HeatEquation;
using CPT.Models.SimulationResults;
using cpt.Models.Simulations;

namespace CPT.Services;

public class HeatEquationApiService
{
    private readonly HttpClient _httpClient;

    public HeatEquationApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<Guid?> CreateSimulationAsync(
    HeatEquationConfiguration configuration,
    bool isDemo = false)
    {
        var simulationRequest = new
        {
            name = configuration.SimulationName,
            description = "2D heat diffusion simulation.",
            physicsModuleId = configuration.PhysicsModuleId,
            isDemo
        };

        var response = await _httpClient.PostAsJsonAsync(
            "api/Simulations",
            simulationRequest);

        if (!response.IsSuccessStatusCode)
        {
            var error =
                await response.Content.ReadAsStringAsync();

            Console.WriteLine(
                $"CREATE SIMULATION FAILED: {(int)response.StatusCode} {response.StatusCode}");

            Console.WriteLine(
                $"CREATE SIMULATION ERROR: {error}");

            return null;
        }

        var simulation =
            await response.Content.ReadFromJsonAsync<SimulationResponse>();

        if (simulation is null)
            return null;

        var simulationId = simulation.Id;

        var parameters = new[]
        {
            new ParameterRequest
            {
                Name = "GridWidth",
                Description = "Number of grid points in the x direction.",
                DataType = "Integer",
                Value = configuration.GridWidth.ToString(),
                Unit = "points"
            },

            new ParameterRequest
            {
                Name = "GridHeight",
                Description = "Number of grid points in the y direction.",
                DataType = "Integer",
                Value = configuration.GridHeight.ToString(),
                Unit = "points"
            },

            new ParameterRequest
            {
                Name = "Width",
                Description = "Physical width of the domain.",
                DataType = "Double",
                Value = (
                    configuration.XMax -
                    configuration.XMin
                ).ToString(
                    CultureInfo.InvariantCulture),
                Unit = "m"
            },

            new ParameterRequest
            {
                Name = "Height",
                Description = "Physical height of the domain.",
                DataType = "Double",
                Value = (
                    configuration.YMax -
                    configuration.YMin
                ).ToString(
                    CultureInfo.InvariantCulture),
                Unit = "m"
            },

            new ParameterRequest
            {
                Name = "ThermalDiffusivity",
                Description = "Thermal diffusivity coefficient.",
                DataType = "Double",
                Value = configuration.ThermalDiffusivity.ToString(
                    CultureInfo.InvariantCulture),
                Unit = "m²/s"
            },

            new ParameterRequest
            {
                Name = "TimeStep",
                Description = "Simulation time step.",
                DataType = "Double",
                Value = configuration.TimeStep.ToString(
                    CultureInfo.InvariantCulture),
                Unit = "s"
            },

            new ParameterRequest
            {
                Name = "TimeSteps",
                Description = "Number of simulation time steps.",
                DataType = "Integer",
                Value = configuration.TimeSteps.ToString(),
                Unit = "steps"
            },

            new ParameterRequest
            {
                Name = "InitialTemperature",
                Description = "Initial temperature of the domain.",
                DataType = "Double",
                Value = configuration.InitialTemperature.ToString(
                    CultureInfo.InvariantCulture),
                Unit = "K"
            },

            new ParameterRequest
            {
                Name = "BoundaryTemperature",
                Description = "Temperature applied at the boundaries.",
                DataType = "Double",
                Value = configuration.BoundaryTemperature.ToString(
                    CultureInfo.InvariantCulture),
                Unit = "K"
            }
        };

        foreach (var parameter in parameters)
        {
            var parameterRequest = new
            {
                simulationId,
                name = parameter.Name,
                description = parameter.Description,
                dataType = parameter.DataType,
                value = parameter.Value,
                unit = parameter.Unit
            };

            var parameterResponse =
                await _httpClient.PostAsJsonAsync(
                    "api/SimulationParameters",
                    parameterRequest);

            if (!parameterResponse.IsSuccessStatusCode)
            {
                var error =
                    await parameterResponse.Content.ReadAsStringAsync();

                Console.WriteLine(
                    $"CREATE PARAMETER FAILED: {(int)parameterResponse.StatusCode} {parameterResponse.StatusCode}");

                Console.WriteLine(
                    $"CREATE PARAMETER ERROR: {error}");

                Console.WriteLine(
                    $"PARAMETER NAME: {parameter.Name}");

                return null;
            }
        }

        return simulationId;
    }

    // public async Task<HeatEquationRunResult?> RunSimulationAsync(
    //     Guid simulationId)
    // {
    //     var response = await _httpClient.PostAsync(
    //         $"api/HeatEquation/run/{simulationId}",
    //         null);

    //     if (!response.IsSuccessStatusCode)
    //         return null;

    //     return await response.Content
    //         .ReadFromJsonAsync<HeatEquationRunResult>();
    // }

    public async Task<bool> RunSimulationAsync(
    Guid simulationId)
    {
        var response = await _httpClient.PostAsync(
            $"api/HeatEquation/run/{simulationId}",
            null);

        return response.IsSuccessStatusCode;
    }

    // public async Task<HeatEquationProgress?> GetProgressAsync(
    // Guid simulationId)
    // {
    //     try
    //     {
    //         return await _httpClient.GetFromJsonAsync<HeatEquationProgress>(
    //             $"api/HeatEquation/progress/{simulationId}");
    //     }
    //     catch
    //     {
    //         return null;
    //     }
    // }

    // public async Task<HeatEquationProgress?> GetProgressAsync(
    // Guid simulationId)
    // {
    //     try
    //     {
    //         var response = await _httpClient.GetAsync(
    //             $"api/HeatEquation/progress/{simulationId}");

    //         if (!response.IsSuccessStatusCode)
    //         {
    //             Console.WriteLine(
    //                 $"Progress request failed: {(int)response.StatusCode} {response.StatusCode}");

    //             return null;
    //         }

    //         return await response.Content.ReadFromJsonAsync<HeatEquationProgress>();
    //     }
    //     catch (Exception ex)
    //     {
    //         Console.WriteLine(
    //             $"Progress request error: {ex}");

    //         return null;
    //     }
    // }

    public async Task<HeatEquationProgress?> GetProgressAsync(Guid simulationId)
    {
        try
        {
            var response = await _httpClient.GetAsync(
                $"api/HeatEquation/progress/{simulationId}");

            Console.WriteLine(
                $"PROGRESS REQUEST: {(int)response.StatusCode} {response.StatusCode}");

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine(
                    $"PROGRESS REQUEST FAILED for {simulationId}");

                return null;
            }

            var progress =
                await response.Content.ReadFromJsonAsync<HeatEquationProgress>();

            Console.WriteLine(
                $"PROGRESS RESPONSE: Status={progress?.Status}, Percent={progress?.Percent}");

            return progress;
        }
        catch (Exception ex)
        {
            Console.WriteLine(
                $"PROGRESS REQUEST ERROR: {ex}");

            return null;
        }
    }

    private sealed class SimulationResponse
    {
        public Guid Id { get; set; }
    }

    private sealed class ParameterRequest
    {
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string DataType { get; set; } = string.Empty;

        public string Value { get; set; } = string.Empty;

        public string Unit { get; set; } = string.Empty;
    }

    public async Task<SimulationResultDto?> GetLatestResultAsync(Guid simulationId)
    {
        var results = await _httpClient.GetFromJsonAsync<
            List<SimulationResultMetadataDto>>(
            $"api/SimulationResults/simulation/{simulationId}");

        var latest = results?.FirstOrDefault();

        if (latest is null)
            return null;

        return await GetResultAsync(latest.Id);
    }

    public async Task<SimulationResultDto?> GetResultAsync(Guid resultId)
    {
        try
        {
            var resultData = await _httpClient.GetStringAsync(
                $"api/SimulationResults/{resultId}");

            return new SimulationResultDto
            {
                ResultData = resultData
            };
        }
        catch
        {
            return null;
        }
    }

    public async Task<SimulationDto?> GetSimulationAsync(Guid simulationId)
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<SimulationDto>(
                $"api/Simulations/{simulationId}");
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> CancelSimulationAsync(
    Guid simulationId)
    {
        try
        {
            var response = await _httpClient.PostAsync(
                $"api/HeatEquation/cancel/{simulationId}",
                null);

            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }
}




