param([switch]$Elevated)

<# 
    ╔══════════════════════════════════════════════════════════════════════════════╗
    ║                     MORNING DEV ENVIRONMENT AUTOMATION                       ║
    ║                                                                              ║
    ║  What this script does:                                                      ║
    ║  1. Closes all non-essential applications (Chrome, Edge, VS Code, etc.)      ║
    ║  2. Sets up your workspace with:                                             ║
    ║     - Clean slate by closing all running applications                        ║
    ║     - Morning status dashboard in Brave on right monitor                     ║
    ║     - Cursor editor on left monitor                                          ║
    ╚══════════════════════════════════════════════════════════════════════════════╝
#>

# Load environment variables from .env file
function Load-EnvFile {
    if (Test-Path ".env") {
        Get-Content ".env" | ForEach-Object {
            if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim()
                [Environment]::SetEnvironmentVariable($key, $value, "Process")
            }
        }
    } else {
        Write-Error "No .env file found. Please create one based on .env.example"
        exit 1
    }
}

function Test-Admin {
    $currentUser = New-Object Security.Principal.WindowsPrincipal $([Security.Principal.WindowsIdentity]::GetCurrent())
    $currentUser.IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)
}

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $Message" | Add-Content $logFile
    Write-Host $Message
}

function Set-WindowPosition {
    param(
        [string]$ProcessName,
        [int]$X,
        [int]$Y,
        [int]$Width,
        [int]$Height,
        [int]$MaxAttempts = 10
    )
    
    try {
        Add-Type @"
            using System;
            using System.Runtime.InteropServices;
            public class Win32 {
                [DllImport("user32.dll")]
                [return: MarshalAs(UnmanagedType.Bool)]
                public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
                
                [DllImport("user32.dll")]
                [return: MarshalAs(UnmanagedType.Bool)]
                public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);
                
                [DllImport("user32.dll")]
                public static extern bool SetForegroundWindow(IntPtr hWnd);

                [DllImport("user32.dll")]
                public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
                
                [StructLayout(LayoutKind.Sequential)]
                public struct RECT
                {
                    public int Left;
                    public int Top;
                    public int Right;
                    public int Bottom;
                }
            }
"@ -ErrorAction Stop

        $attempt = 0
        while ($attempt -lt $MaxAttempts) {
            Start-Sleep -Seconds 1
            $process = Get-Process -Name $ProcessName -ErrorAction Stop | 
                      Where-Object { $_.MainWindowHandle -ne 0 } |
                      Select-Object -First 1
            
            if ($process -and $process.MainWindowHandle -ne 0) {
                [Win32]::ShowWindow($process.MainWindowHandle, 3)
                $result = [Win32]::MoveWindow($process.MainWindowHandle, $X, $Y, $Width, $Height, $true)
                [Win32]::SetForegroundWindow($process.MainWindowHandle)
                Write-Log "Positioned $ProcessName window on attempt $($attempt)"
                return $true
            }
            $attempt++
            Write-Log "Attempt $($attempt): Waiting for $ProcessName window..."
        }
        Write-Log "Failed to position $ProcessName window after $MaxAttempts attempts"
        return $false
    } catch {
        Write-Log "Error positioning $ProcessName window: $_"
        return $false
    }
}

# Main script execution starts here
if ((Test-Admin) -eq $false) {
    if ($elevated) { exit } 
    else {
        Start-Process powershell.exe -Verb RunAs -ArgumentList ('-noprofile -file "{0}" -elevated -WindowStyle Hidden' -f ($myinvocation.MyCommand.Definition))
        exit
    }
}

# Load environment variables
Load-EnvFile

# Get the script's directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Initialize logging
$logFile = Join-Path $scriptDir "morning-report.txt"
Clear-Content $logFile -ErrorAction SilentlyContinue

Write-Log "Starting morning setup..."

# Read the template HTML
$templatePath = Join-Path $scriptDir "current-status.html"
$htmlContent = Get-Content $templatePath -Raw -Encoding UTF8

# Replace API keys and user settings with environment variables
$htmlContent = $htmlContent -replace 'const apiKey = ".*?"', ('const apiKey = "' + $env:WEATHER_API_KEY + '"')
$htmlContent = $htmlContent -replace 'const zipCode = ".*?"', ('const zipCode = "' + $env:ZIP_CODE + '"')
$htmlContent = $htmlContent -replace 'const finnhubKey = ".*?"', ('const finnhubKey = "' + $env:FINNHUB_API_KEY + '"')

# Update crypto quantities from environment variables
$cryptoHoldings = @{
    XRP = $env:XRP_HOLDINGS
    XYO = $env:XYO_HOLDINGS
    BTC = $env:BTC_HOLDINGS
}

$cryptoJson = $cryptoHoldings | ConvertTo-Json
$htmlContent = $htmlContent -replace 'const cryptoQuantities = \{[^}]+\}', "const cryptoQuantities = $cryptoJson"

# Update stock quantities from environment variables
$stockHoldings = @{
    META = $env:META_SHARES
    TSLA = $env:TSLA_SHARES
    AMZN = $env:AMZN_SHARES
    NVDA = $env:NVDA_SHARES
    GOOGL = $env:GOOGL_SHARES
    MSFT = $env:MSFT_SHARES
    NFLX = $env:NFLX_SHARES
    T = $env:T_SHARES
}

$stockJson = $stockHoldings | ConvertTo-Json
$htmlContent = $htmlContent -replace 'const stockShares = \{[^}]+\}', "const stockShares = $stockJson"

# Update greeting name
$htmlContent = $htmlContent -replace 'User', $env:USER_NAME

# Write the modified HTML back to the file
$htmlContent | Out-File $templatePath -Encoding UTF8

# Kill all non-essential processes
$processesToKill = @(
    "brave",
    "claude",
    "ApplicationFrameHost",
    "SystemSettings",
    "TextInputHost",
    "Cursor",
    "Code",
    "notepad",
    "slack"
)

foreach ($proc in $processesToKill) {
    try {
        Get-Process -Name $proc -ErrorAction SilentlyContinue | Stop-Process -Force
        Write-Log "Killed $proc successfully"
    } catch {
        Write-Log "No $proc process found"
    }
}

# Wait a moment for processes to close
Start-Sleep -Seconds 2

$leftMonitor = @{
    X = 0
    Y = 0
    Width = 1920
    Height = 1080
}

$rightMonitor = @{
    X = 1920
    Y = 0
    Width = 960
    Height = 1080
}

$rightMonitorSecondHalf = @{
    X = 2880
    Y = 0
    Width = 960
    Height = 1080
}

# Launch applications with retries
Write-Log "Launching applications..."

# Launch Cursor on left monitor
Start-Process "C:\Users\$env:USERNAME\AppData\Local\Programs\Cursor\Cursor.exe"
Start-Sleep -Seconds 5
Set-WindowPosition -ProcessName "Cursor" @leftMonitor

# Find Brave browser path
$bravePath = "${env:LOCALAPPDATA}\BraveSoftware\Brave-Browser\Application\brave.exe"
if (-not (Test-Path $bravePath)) {
    $bravePath = "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
}

# Launch dashboard in Brave split across right monitor
Start-Process $bravePath -ArgumentList "--new-window", "file:///$templatePath"
Start-Sleep -Seconds 5
Set-WindowPosition -ProcessName "brave" @rightMonitor

# Launch a blank tab in the second window
Start-Process $bravePath -ArgumentList "--new-window", "about:blank"
Start-Sleep -Seconds 5
Set-WindowPosition -ProcessName "brave" @rightMonitorSecondHalf

Write-Log "Setup completed successfully!"

# Show notifications
New-BurntToastNotification -Text "Morning Dev Environment", "Setup completed successfully! Your workspace is ready." -AppLogo "C:\Windows\System32\SecurityAndMaintenance.png"

# Keep window open
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
