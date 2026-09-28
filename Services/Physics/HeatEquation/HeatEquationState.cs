using CPT.Models.HeatEquation;

namespace CPT.Services.Physics.HeatEquation;

public class HeatEquationState
{
    public HeatEquationConfiguration? Configuration { get; set; }

    public Guid? SimulationId { get; set; }

    public HeatEquationRunResult? RunResult { get; set; }

    public bool IsRunning { get; set; }

    public bool IsCompleted =>
        RunResult?.Status == "Completed";

    public void Reset()
    {
        Configuration = null;
        SimulationId = null;
        RunResult = null;
        IsRunning = false;
    }
}