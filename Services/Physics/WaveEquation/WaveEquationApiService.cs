using System.Globalization;
using System.Net.Http.Json;
using CPT.Models.SimulationResults;
using CPT.Models.WaveEquation;
using cpt.Models.Simulations;

namespace CPT.Services;

public class WaveEquationApiService
{
    private readonly HttpClient _httpClient;

    public WaveEquationApiService(
        HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<Guid?> CreateSimulationAsync(
        WaveEquationConfiguration configuration,
        bool isDemo = false)
    {
        var simulationRequest = new
        {
            name = configuration.SimulationName,

            description =
                "1D wave propagation simulation.",

            physicsModuleId =
                configuration.PhysicsModuleId,

            isDemo
        };

        var response =
            await _httpClient.PostAsJsonAsync(
                "api/Simulations",
                simulationRequest);

        if (!response.IsSuccessStatusCode)
        {
            var error =
                await response.Content
                    .ReadAsStringAsync();

            Console.WriteLine(
                $"CREATE WAVE SIMULATION FAILED: " +
                $"{(int)response.StatusCode} " +
                $"{response.StatusCode}");

            Console.WriteLine(
                $"CREATE WAVE SIMULATION ERROR: {error}");

            return null;
        }

        var simulation =
            await response.Content
                .ReadFromJsonAsync<SimulationResponse>();

        if (simulation is null)
            return null;

        var simulationId =
            simulation.Id;

        var parameters = new[]
        {
            new ParameterRequest
            {
                Name = "GridPoints",

                Description =
                    "Number of spatial grid points.",

                DataType = "Integer",

                Value =
                    configuration.GridPoints.ToString(),

                Unit = "points"
            },

            new ParameterRequest
            {
                Name = "Length",

                Description =
                    "Physical length of the string.",

                DataType = "Double",

                Value =
                    configuration.Length.ToString(
                        CultureInfo.InvariantCulture),

                Unit = "m"
            },

            new ParameterRequest
            {
                Name = "WaveSpeed",

                Description =
                    "Wave propagation speed.",

                DataType = "Double",

                Value =
                    configuration.WaveSpeed.ToString(
                        CultureInfo.InvariantCulture),

                Unit = "m/s"
            },

            new ParameterRequest
            {
                Name = "TimeStep",

                Description =
                    "Simulation time step.",

                DataType = "Double",

                Value =
                    configuration.TimeStep.ToString(
                        CultureInfo.InvariantCulture),

                Unit = "s"
            },

            new ParameterRequest
            {
                Name = "TimeSteps",

                Description =
                    "Number of simulation time steps.",

                DataType = "Integer",

                Value =
                    configuration.TimeSteps.ToString(),

                Unit = "steps"
            },

            new ParameterRequest
            {
                Name = "InitialAmplitude",

                Description =
                    "Initial displacement amplitude.",

                DataType = "Double",

                Value =
                    configuration.InitialAmplitude.ToString(
                        CultureInfo.InvariantCulture),

                Unit = "m"
            },

            new ParameterRequest
            {
                Name = "InitialConditionType",

                Description =
                    "Initial displacement profile.",

                DataType = "String",

                Value =
                    configuration.InitialConditionType,

                Unit = ""
            }
        };

        foreach (var parameter in parameters)
        {
            var parameterRequest = new
            {
                simulationId,

                name = parameter.Name,

                description =
                    parameter.Description,

                dataType =
                    parameter.DataType,

                value =
                    parameter.Value,

                unit =
                    parameter.Unit
            };

            var parameterResponse =
                await _httpClient.PostAsJsonAsync(
                    "api/SimulationParameters",
                    parameterRequest);

            if (!parameterResponse.IsSuccessStatusCode)
            {
                var error =
                    await parameterResponse.Content
                        .ReadAsStringAsync();

                Console.WriteLine(
                    $"CREATE WAVE PARAMETER FAILED: " +
                    $"{(int)parameterResponse.StatusCode} " +
                    $"{parameterResponse.StatusCode}");

                Console.WriteLine(
                    $"PARAMETER NAME: {parameter.Name}");

                Console.WriteLine(
                    $"PARAMETER ERROR: {error}");

                return null;
            }
        }

        return simulationId;
    }

    public async Task<bool> RunSimulationAsync(
        Guid simulationId)
    {
        try
        {
            var response =
                await _httpClient.PostAsync(
                    $"api/WaveEquation/run/{simulationId}",
                    null);

            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    public async Task<WaveEquationProgress?> GetProgressAsync(
        Guid simulationId)
    {
        try
        {
            var response =
                await _httpClient.GetAsync(
                    $"api/WaveEquation/progress/{simulationId}");

            if (!response.IsSuccessStatusCode)
                return null;

            return await response.Content
                .ReadFromJsonAsync<WaveEquationProgress>();
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
            var response =
                await _httpClient.PostAsync(
                    $"api/WaveEquation/cancel/{simulationId}",
                    null);

            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    public async Task<SimulationResultDto?>
        GetLatestResultAsync(
            Guid simulationId)
    {
        try
        {
            var results =
                await _httpClient.GetFromJsonAsync<
                    List<SimulationResultMetadataDto>>(
                        $"api/SimulationResults/simulation/{simulationId}");

            var latest =
                results?.FirstOrDefault();

            if (latest is null)
                return null;

            return await GetResultAsync(
                latest.Id);
        }
        catch
        {
            return null;
        }
    }

    public async Task<SimulationResultDto?>
        GetResultAsync(
            Guid resultId)
    {
        try
        {
            var resultData =
                await _httpClient.GetStringAsync(
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

    public async Task<SimulationDto?>
        GetSimulationAsync(
            Guid simulationId)
    {
        try
        {
            return await _httpClient
                .GetFromJsonAsync<SimulationDto>(
                    $"api/Simulations/{simulationId}");
        }
        catch
        {
            return null;
        }
    }

    private sealed class SimulationResponse
    {
        public Guid Id { get; set; }
    }

    private sealed class ParameterRequest
    {
        public string Name { get; set; } =
            string.Empty;

        public string Description { get; set; } =
            string.Empty;

        public string DataType { get; set; } =
            string.Empty;

        public string Value { get; set; } =
            string.Empty;

        public string Unit { get; set; } =
            string.Empty;
    }
}