using System.Text.Json.Serialization;

namespace cpt.Models.HeatEquation;

public class HeatEquationResultData
{
    public int GridWidth { get; set; }
    public int GridHeight { get; set; }

    public double Width { get; set; }
    public double Height { get; set; }

    public double ThermalDiffusivity { get; set; }

    public double InitialTemperature { get; set; }
    public double BoundaryTemperature { get; set; }

    public string BoundaryConditionType { get; set; } = string.Empty;
    public string TopBoundaryCondition { get; set; } = string.Empty;
    public string BottomBoundaryCondition { get; set; } = string.Empty;
    public string LeftBoundaryCondition { get; set; } = string.Empty;
    public string RightBoundaryCondition { get; set; } = string.Empty;

    public double TimeStep { get; set; }
    public int TimeSteps { get; set; }

    public double FinalTime { get; set; }

    public double ExecutionTimeMs { get; set; }

    [JsonPropertyName("temperature")] public double[][] Temperature { get; set; } = [];

    public List<double[][]> TemperatureHistory { get; set; } = [];
}