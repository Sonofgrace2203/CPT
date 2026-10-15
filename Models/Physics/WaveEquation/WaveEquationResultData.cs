namespace CPT.Models.WaveEquation;

public class WaveEquationResultData
{
    public int GridPoints { get; set; }

    public double Length { get; set; }

    public double WaveSpeed { get; set; }

    public double TimeStep { get; set; }

    public int TimeSteps { get; set; }

    public double FinalTime { get; set; }

    public double Dx { get; set; }

    public double CFLNumber { get; set; }

    public string StabilityStatus { get; set; } = string.Empty;

    public double InitialAmplitude { get; set; }

    public string InitialConditionType { get; set; } = string.Empty;

    public string BoundaryConditionType { get; set; } = string.Empty;

    public double[] Displacement { get; set; } = [];

    public List<double[]> DisplacementHistory { get; set; } = [];
}