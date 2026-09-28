namespace cpt.Models.Simulations;

public class SimulationDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public Guid PhysicsModuleId { get; set; }

    public string PhysicsModuleName { get; set; } = string.Empty;

    public string? PhysicsModuleImageUrl { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool IsFavourite { get; set; }

    public string Status { get; set; } = "Not started";
}