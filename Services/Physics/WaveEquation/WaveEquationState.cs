using CPT.Models.WaveEquation;

namespace CPT.Services.Physics.WaveEquation;

public class WaveEquationState
{
    public WaveEquationConfiguration? Configuration
    {
        get;
        set;
    }

    public Guid? SimulationId
    {
        get;
        set;
    }

    public bool IsRunning
    {
        get;
        set;
    }

    public bool IsCompleted
    {
        get;
        set;
    }

    public void Reset()
    {
        Configuration = null;
        SimulationId = null;
        IsRunning = false;
        IsCompleted = false;
    }
}