using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using cpt;
using CPT.Services;
using CPT.Services.Physics.HeatEquation;
using CPT.Services.Auth;
// using Plotly.Blazor;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

Console.WriteLine($"CPT Environment: {builder.HostEnvironment.Environment}");
Console.WriteLine($"CPT API Base URL: {builder.Configuration["ApiBaseUrl"]}");

builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

// builder.Services.AddScoped(sp =>
//     new HttpClient
//     {
//         BaseAddress = new Uri("http://localhost:5121/")
//     });

builder.Services.AddScoped<BrowserStorageService>();
builder.Services.AddScoped<JwtAuthorizationHandler>();
builder.Services.AddScoped<AuthSessionService>();

// builder.Services.AddScoped(sp =>
// {
//     var handler =
//         sp.GetRequiredService<JwtAuthorizationHandler>();

//     handler.InnerHandler = new HttpClientHandler();

//     return new HttpClient(handler)
//     {
//         BaseAddress =
//             new Uri("http://localhost:5121/")
//     };
// });

builder.Services.AddScoped(sp =>
{
    var handler =
        sp.GetRequiredService<JwtAuthorizationHandler>();

    handler.InnerHandler = new HttpClientHandler();

    var configuration =
        sp.GetRequiredService<IConfiguration>();

    var apiBaseUrl =
        configuration["ApiBaseUrl"]
        ?? throw new InvalidOperationException(
            "API base URL is not configured.");

    return new HttpClient(handler)
    {
        BaseAddress = new Uri(apiBaseUrl)
    };
});

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<HeatEquationApiService>();
builder.Services.AddScoped<HeatEquationState>();
builder.Services.AddScoped<DashboardApiService>();
builder.Services.AddSingleton<PhysicsModuleCatalogue>();
builder.Services.AddScoped<SimulationApiService>();
builder.Services.AddScoped<UserSettingsApiService>();
builder.Services.AddScoped<PhysicsModuleApiService>();
builder.Services.AddScoped<AdminUserApiService>();
builder.Services.AddScoped<AdminDashboardApiService>();

// builder.Services.AddPlotly();

await builder.Build().RunAsync();
