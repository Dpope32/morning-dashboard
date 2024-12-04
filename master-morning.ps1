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


# Function to check admin privileges
function Test-Admin {
    $currentUser = New-Object Security.Principal.WindowsPrincipal $([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentUser.IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)
}

# Ensure script is running with admin privileges unless $Elevated is specified
if (-not $Elevated -and -not (Test-Admin)) {
    Write-Host "Restarting script with admin privileges..."
    Start-Process PowerShell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File '$PSCommandPath' -Elevated" -Verb RunAs
    exit
}

Write-Host "Script running with administrative privileges"


# Function to kill processes by name
function Kill-Processes {
    param([string[]]$ProcessNames)

    foreach ($procName in $ProcessNames) {
        try {
            Get-Process -Name $procName -ErrorAction SilentlyContinue | Stop-Process -Force
            Write-Host "Successfully terminated process: $procName"
        } catch {
            Write-Host "Process not found or could not be terminated: $procName"
        }
    }
}

function Load-EnvFile {
    param (
        [string]$FilePath = "$PSScriptRoot\.env"
    )

    if (-Not (Test-Path $FilePath)) {
        Write-Warning "Environment file '$FilePath' not found."
        return
    }

    Get-Content $FilePath | ForEach-Object {
        if ($_ -match '^\s*([^#=\s]+)\s*=\s*(.*)\s*$') {
            $name = $matches[1]
            $value = $matches[2]
            [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "Loaded environment variable: $name"
        }
    }
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
            $process = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue | 
                      Where-Object { $_.MainWindowHandle -ne 0 } |
                      Select-Object -First 1
            
            if ($process -and $process.MainWindowHandle -ne 0) {
                [Win32]::ShowWindow($process.MainWindowHandle, 3)
                $result = [Win32]::MoveWindow($process.MainWindowHandle, $X, $Y, $Width, $Height, $true)
                [Win32]::SetForegroundWindow($process.MainWindowHandle)
                Write-Log "Positioned $ProcessName window on attempt $($attempt + 1)"
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

Write-Host "Script running with administrative privileges"

# Get the script's directory
$scriptDir = $PSScriptRoot
Write-Host "Script directory: $scriptDir"

# Initialize logging
$logFile = Join-Path $scriptDir "morning-report.txt"
Clear-Content $logFile -ErrorAction SilentlyContinue

Write-Log "Starting morning setup..."

# Load environment variables
Load-EnvFile

# Generate env.js file with environment variables
$envJsPath = Join-Path $scriptDir "env.js"
Write-Log "Generating env.js at: $envJsPath"

$envVariables = @{
    WEATHER_API_KEY = $env:WEATHER_API_KEY
    FINNHUB_API_KEY = $env:FINNHUB_API_KEY
    ZIP_CODE = $env:ZIP_CODE
    USER_NAME = $env:USER_NAME
    XRP_HOLDINGS = $env:XRP_HOLDINGS
    XYO_HOLDINGS = $env:XYO_HOLDINGS
    BTC_HOLDINGS = $env:BTC_HOLDINGS
    META_SHARES = $env:META_SHARES
    TSLA_SHARES = $env:TSLA_SHARES
    AMZN_SHARES = $env:AMZN_SHARES
    NVDA_SHARES = $env:NVDA_SHARES
    GOOGL_SHARES = $env:GOOGL_SHARES
    MSFT_SHARES = $env:MSFT_SHARES
    NFLX_SHARES = $env:NFLX_SHARES
    T_SHARES = $env:T_SHARES
}

$envJson = ConvertTo-Json $envVariables -Compress

$envJsContent = "window.ENV = $envJson;`n`n" + @"
// Log environment variables for debugging
console.log('Environment variables loaded:', window.ENV);

// Notify that env variables are ready
window.dispatchEvent(new Event('envLoaded'));
"@

$envJsContent | Out-File $envJsPath -Encoding UTF8

Write-Log "env.js generated successfully"

# Kill all non-essential processes
$processesToKill = @(
    "brave",
    "BraveBrowser",
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
        Write-Log "No $proc process found or unable to kill"
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
$cursorPath = "C:\Users\$env:USERNAME\AppData\Local\Programs\Cursor\Cursor.exe"
Write-Log "Launching Cursor from: $cursorPath"
Start-Process $cursorPath
Start-Sleep -Seconds 5
Set-WindowPosition -ProcessName "Cursor" @leftMonitor

# Find Brave browser path
$bravePath = "${env:LOCALAPPDATA}\BraveSoftware\Brave-Browser\Application\brave.exe"
if (-not (Test-Path $bravePath)) {
    $bravePath = "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
}
Write-Log "Using Brave browser from: $bravePath"

# Launch dashboard in Brave split across right monitor
$templatePath = Join-Path $scriptDir "current-status.html"
$templateUri = "file:///" + $templatePath.Replace("\", "/")
Write-Log "Opening dashboard at: $templateUri"
Start-Process $bravePath -ArgumentList "--new-window", $templateUri
Start-Sleep -Seconds 5

# Try both process names for Brave
$braveProcessNames = @("brave", "BraveBrowser")
$bravePositioned = $false

foreach ($procName in $braveProcessNames) {
    Write-Log "Attempting to position $procName..."
    if (Set-WindowPosition -ProcessName $procName @rightMonitor) {
        $bravePositioned = $true
        break
    }
}

if (-not $bravePositioned) {
    Write-Warning "Failed to position Brave browser window. You may need to position it manually."
}

foreach ($procName in $braveProcessNames) {
    Write-Log "Attempting to position second $procName window..."
    if (Set-WindowPosition -ProcessName $procName @rightMonitorSecondHalf) {
        break
    }
}

Write-Log "Setup completed successfully!"

# Try to show notification if BurntToast is available
try {
    if (Get-Module -ListAvailable -Name BurntToast) {
        New-BurntToastNotification -Text "Morning Dev Environment", "Setup completed successfully! Your workspace is ready." -AppLogo "C:\Windows\System32\SecurityAndMaintenance.png"
    }
} catch {
    Write-Log "BurntToast notifications not available"
}

Write-Host "Morning setup completed successfully!"
