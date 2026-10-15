using System.ComponentModel.DataAnnotations;

namespace CPT.Models.WaveEquation;

public class WaveEquationConfiguration
{
    [Required]
    [StringLength(100)]
    public string SimulationName { get; set; } = "";

    public Guid PhysicsModuleId { get; set; }

    [Range(3, 100000)]
    public int GridPoints { get; set; } = 101;

    [Range(0.000001, double.MaxValue)]
    public double Length { get; set; } = 10.0;

    [Range(0.000001, double.MaxValue)]
    public double WaveSpeed { get; set; } = 1.0;

    [Range(0.000001, double.MaxValue)]
    public double TotalTime { get; set; } = 10.0;

    [Range(0.000001, double.MaxValue)]
    public double TimeStep { get; set; } = 0.01;

    [Range(0.000001, double.MaxValue)]
    public double InitialAmplitude { get; set; } = 1.0;

    public string InitialConditionType { get; set; } =
        "Gaussian Pulse";

    public int TimeSteps =>
        TimeStep > 0
            ? (int)Math.Ceiling(TotalTime / TimeStep)
            : 0;
}