namespace CPT.Models.HeatEquation;

public class HeatEquationRunResult
{
    public Guid Id { get; set; }

    public Guid SimulationId { get; set; }

    public string Status { get; set; } = string.Empty;

    public double ExecutionTimeMs { get; set; }

    public DateTime CreatedAt { get; set; }

    public string ResultData { get; set; } = string.Empty;
}