
namespace CPT.Models.UserSettings;

public class WaveEquationSettingsDto
{
    public int GridPoints { get; set; } = 101;

    public double Length { get; set; } = 10.0;

    public double WaveSpeed { get; set; } = 1.0;

    public double TotalTime { get; set; } = 10.0;

    public double TimeStep { get; set; } = 0.01;

    public double InitialAmplitude { get; set; } = 1.0;

    public string InitialConditionType { get; set; } = "Gaussian Pulse";
}
