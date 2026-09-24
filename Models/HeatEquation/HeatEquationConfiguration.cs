using System.ComponentModel.DataAnnotations;

namespace CPT.Models.HeatEquation;

public class HeatEquationConfiguration
{
    [Required(ErrorMessage = "Please enter a simulation name.")]
    [StringLength(
        100,
        ErrorMessage = "Simulation name cannot exceed 100 characters.")]
    public string SimulationName { get; set; } = string.Empty;

    public Guid PhysicsModuleId { get; set; }

    public double ThermalDiffusivity { get; set; } = 0.21;

    public double TotalTime { get; set; } = 1.0;

    public double TimeStep { get; set; } = 0.0005;

    public int GridWidth { get; set; } = 20;

    public int GridHeight { get; set; } = 20;

    public double XMin { get; set; } = -1.0;

    public double XMax { get; set; } = 1.0;

    public double YMin { get; set; } = -1.0;

    public double YMax { get; set; } = 1.0;

    public double InitialTemperature { get; set; } = 100.0;

    public double BoundaryTemperature { get; set; } = 0.0;

    public int TimeSteps =>
        (int)Math.Ceiling(
            TotalTime / TimeStep);
}