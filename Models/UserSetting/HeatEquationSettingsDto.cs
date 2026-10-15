
namespace CPT.Models.UserSettings;

public class HeatEquationSettingsDto
{
    public string SolverType { get; set; } = "Finite Difference";

    public int GridWidth { get; set; } = 100;

    public int GridHeight { get; set; } = 100;

    public double TimeStep { get; set; } = 0.001;

    public double TotalTime { get; set; } = 10.0;

    public string BoundaryCondition { get; set; } = "Fixed Temperature";
}
