
namespace CPT.Models.UserSettings;

public class UserSettingsDto
{
    public string NumberFormat { get; set; } = "decimal";

    public bool AutoSaveSimulation { get; set; } = true;

    public bool ConfirmBeforeDelete { get; set; } = true;
}
