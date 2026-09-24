namespace cpt.Models.Dashboard;

public class DashboardDto
{
    public int TotalSimulations { get; set; }

    public int ModulesUsed { get; set; }

    public int CompletedResults { get; set; }

    public int FavouriteSimulations { get; set; }

    public List<RecentSimulationDto> RecentSimulations { get; set; }
        = new();

    public List<WeeklyActivityDto> WeeklyActivity { get; set; }
        = new();

    public List<AvailableModuleDto> AvailableModules { get; set; }
    = new();
}

public class RecentSimulationDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string ModuleName { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}

public class WeeklyActivityDto
{
    public DateTime Date { get; set; }

    public int Count { get; set; }
}

public class AvailableModuleDto
{
    public string Name { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Icon { get; set; } = string.Empty;

    public string Route { get; set; } = string.Empty;

    public int SimulationCount { get; set; }
}
