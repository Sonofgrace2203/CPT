namespace CPT.Models.Admin;

public class AdminRecentSimulationDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ModuleName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}