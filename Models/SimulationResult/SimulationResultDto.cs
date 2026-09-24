namespace CPT.Models.SimulationResults;

public class SimulationResultDto
{
    public Guid Id { get; set; }

    public Guid SimulationId { get; set; }

    public string Status { get; set; } = string.Empty;

    public double ExecutionTimeMs { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? ResultData { get; set; }
}