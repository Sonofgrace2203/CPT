namespace CPT.Models.Auth;

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;

    public AuthUser User { get; set; } = new();
}

public class AuthUser
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string? Email { get; set; }

    public List<string> Roles { get; set; } = new();
}