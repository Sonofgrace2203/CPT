namespace CPT.Models.Admin;

public class CptUserDto
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string? Email { get; set; }

    public DateTime CreatedAt { get; set; }

    public List<string> Roles { get; set; } = new();

    public int TotalSimulations { get; set; }

    public int ModulesUsed { get; set; }

    public int CompletedResults { get; set; }

    public int FavouriteSimulations { get; set; }
}