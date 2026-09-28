namespace CPT.Models.Admin;

public class AdminDashboardDto
{
    public int TotalUsers { get; set; }

    public int NewUsersThisWeek { get; set; }

    public int ActiveUsers { get; set; }

    public int TotalSimulations { get; set; }

    public int CompletedSimulations { get; set; }

    public int RunningSimulations { get; set; }

    public int FailedSimulations { get; set; }

    public int DemoSimulations { get; set; }

    public int AuthenticatedSimulations { get; set; }

    public int ActiveModules { get; set; }

    public int TotalModuleUsage { get; set; }

    public int TotalAdmins { get; set; }

    public int TotalSuperAdmins { get; set; }

    public List<AdminWeeklyActivityDto> WeeklyActivity { get; set; } = new();

    public List<AdminModuleUsageDto> ModuleUsage { get; set; } = new();

    public int MyTotalSimulations { get; set; }
    public int MyModulesUsed { get; set; }
    public int MyCompletedResults { get; set; }
    public int MyFavouriteSimulations { get; set; }

    public List<AdminModuleUsageDto> MyModuleUsage { get; set; } = new();

    public List<AdminRecentSimulationDto> MyRecentSimulations { get; set; } = new();

    public List<AdminWeeklyActivityDto> MyWeeklyActivity { get; set; } = new();
}