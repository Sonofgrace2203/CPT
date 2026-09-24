namespace CPT.Models.Admin;

public class AdminModuleUsageDto
{
    public Guid ModuleId { get; set; }

    public string ModuleName { get; set; } = string.Empty;

    public int SimulationCount { get; set; }
}