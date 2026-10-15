namespace CPT.Models.WaveEquation;

public class WaveEquationRunResult
{
    public Guid SimulationId { get; set; }

    public string Status { get; set; } = string.Empty;

    public double ExecutionTimeMs { get; set; }

    public DateTime CreatedAt { get; set; }

    public WaveEquationResultData? ResultData { get; set; }
}