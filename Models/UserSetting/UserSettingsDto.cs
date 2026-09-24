namespace CPT.Models.UserSettings;

public class UserSettingsDto
{
    public string NumberFormat { get; set; } = "decimal";

    public bool AutoSaveSimulation { get; set; } = true;

    public bool ConfirmBeforeDelete { get; set; } = true;

    public string SolverType { get; set; } = "Finite Difference";

    public int GridWidth { get; set; } = 100;

    public int GridHeight { get; set; } = 100;

    public double TimeStep { get; set; } = 0.001;

    public double TotalTime { get; set; } = 10.0;

    public string BoundaryCondition { get; set; } = "Fixed Temperature";
}