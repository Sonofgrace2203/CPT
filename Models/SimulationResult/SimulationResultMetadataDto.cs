namespace CPT.Models.SimulationResults;

public class SimulationResultMetadataDto
{
    public Guid Id { get; set; }

    public Guid SimulationId { get; set; }

    public string SimulationName { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public double ExecutionTimeMs { get; set; }

    public DateTime CreatedAt { get; set; }
}