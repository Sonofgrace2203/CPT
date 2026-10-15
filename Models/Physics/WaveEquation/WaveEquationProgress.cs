namespace CPT.Models.WaveEquation;

public class WaveEquationProgress
{
    public Guid SimulationId { get; set; }

    public string Status { get; set; } = "Pending";

    public int CurrentStep { get; set; }

    public int TotalSteps { get; set; }

    public double CurrentTime { get; set; }

    public double TotalTime { get; set; }

    public double Percent { get; set; }

    public double ElapsedTimeMs { get; set; }

    public double EstimatedTimeRemainingMs { get; set; }

    public double[]? Displacement { get; set; }

    public string? ErrorMessage { get; set; }
}