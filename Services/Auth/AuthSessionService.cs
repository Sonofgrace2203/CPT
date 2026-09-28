using Microsoft.JSInterop;
using Microsoft.AspNetCore.Components;

namespace CPT.Services.Auth;

public class AuthSessionService : IAsyncDisposable
{
    private readonly IJSRuntime _jsRuntime;
    private readonly AuthService _authService;
    private readonly NavigationManager _navigation;

    private PeriodicTimer? _timer;
    private CancellationTokenSource? _cancellationTokenSource;

    private const int InactivityMinutes = 120;

    public AuthSessionService(
        IJSRuntime jsRuntime,
        AuthService authService,
        NavigationManager navigation)
    {
        _jsRuntime = jsRuntime;
        _authService = authService;
        _navigation = navigation;
    }

    public async Task StartAsync()
    {
        await _jsRuntime.InvokeVoidAsync(
            "cptAuthSession.initialize");

        _cancellationTokenSource =
            new CancellationTokenSource();

        _timer = new PeriodicTimer(
            TimeSpan.FromMinutes(1));

        _ = MonitorSessionAsync(
            _cancellationTokenSource.Token);
    }

    private async Task MonitorSessionAsync(
        CancellationToken cancellationToken)
    {
        if (_timer is null)
        {
            return;
        }

        while (await _timer.WaitForNextTickAsync(
            cancellationToken))
        {
            var token =
                await _authService.GetTokenAsync();

            if (string.IsNullOrWhiteSpace(token))
            {
                continue;
            }

            var lastActivity =
                await _jsRuntime.InvokeAsync<string?>(
                    "cptAuthSession.getLastActivity");

            if (!long.TryParse(
                    lastActivity,
                    out var lastActivityMilliseconds))
            {
                continue;
            }

            var lastActivityTime =
                DateTimeOffset
                    .FromUnixTimeMilliseconds(
                        lastActivityMilliseconds);

            var inactiveFor =
                DateTimeOffset.UtcNow -
                lastActivityTime;

            if (inactiveFor.TotalMinutes >=
                InactivityMinutes)
            {
                await _authService.LogoutAsync();

                _navigation.NavigateTo(
                    "Login",
                    forceLoad: true);

                break;
            }
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_cancellationTokenSource is not null)
        {
            _cancellationTokenSource.Cancel();
            _cancellationTokenSource.Dispose();
        }

        _timer?.Dispose();

        await Task.CompletedTask;
    }
}