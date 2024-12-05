# Note: Please update your .env file to use the correct Claude path:
# CLAUDE_PATH=C:\Users\%WINDOWS_USERNAME%\AppData\Local\AnthropicClaude\app-0.7.5\claude.exe

param([switch]$Elevated)

<# 
    ╔══════════════════════════════════════════════════════════════════════════════╗
    ║                     MORNING DEV ENVIRONMENT AUTOMATION                       ║
    ║                                                                              ║
    ║  What this script does:                                                      ║
    ║  1. Closes non-essential applications (Chrome, Edge, VS Code, etc.)          ║
    ║  2. Sets up your workspace with:                                             ║
    ║     - Clean slate by closing specified applications                          ║
    ║     - Morning status dashboard in Brave                                      ║
    ║     - Claude on left monitor                                                 ║
    ║     - Opens Obsidian vault on right monitor                                  ║
    ╚══════════════════════════════════════════════════════════════════════════════╝
#>

# Ensure the script can run by modifying the execution policy
if ((Get-ExecutionPolicy -Scope CurrentUser) -ne 'RemoteSigned') {
    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
}

# Function to kill processes by name
function Kill-Processes {
    param([string[]]$ProcessNames)

    foreach ($procName in $processesToKill) {
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
            # Replace %WINDOWS_USERNAME% with actual value in paths
            if ($value -like '*%WINDOWS_USERNAME%*' -and $env:WINDOWS_USERNAME) {
                $value = $value.Replace('%WINDOWS_USERNAME%', $env:WINDOWS_USERNAME)
            }
            [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
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
        [int]$MaxAttempts = 3
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
                Write-Log "Positioned window successfully"
                return $true
            }
            $attempt++
            Write-Log "Waiting for window..."
        }
        Write-Log "Failed to position window after $MaxAttempts attempts"
        return $false
    } catch {
        Write-Log "Error positioning window"
        return $false
    }
}

# Get the script's directory
$scriptDir = $PSScriptRoot

# Initialize logging
$logFile = Join-Path $scriptDir "morning-report.txt"
Clear-Content $logFile -ErrorAction SilentlyContinue

Write-Log "Starting morning setup..."

# Load environment variables
Load-EnvFile

# Generate env.js file with environment variables (excluding sensitive data)
$envJsPath = Join-Path $scriptDir "env.js"
Write-Log "Generating env.js"

$envVariables = @{
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

$envVariables["WEATHER_API_KEY"] = $env:WEATHER_API_KEY
$envVariables["FINNHUB_API_KEY"] = $env:FINNHUB_API_KEY

$envJson = ConvertTo-Json $envVariables -Compress
$envJsContent = "window.ENV = $envJson;`n"
$envJsContent | Out-File $envJsPath -Encoding UTF8

Write-Log "Configuration generated"

# Kill all non-essential processes
$processesToKill = @(
    "brave",
    "BraveBrowser",
    "ApplicationFrameHost",
    "SystemSettings",
    "TextInputHost",
    "Code",
    "notepad",
    "slack"
)

foreach ($proc in $processesToKill) {
    try {
        Get-Process -Name $proc -ErrorAction SilentlyContinue | Stop-Process -Force
        Write-Log "Closed application successfully"
    } catch {
        Write-Log "Application not found or unable to close"
    }
}

# Wait a moment for processes to close
Start-Sleep -Seconds 2

$rightMonitor = @{
    X = 1920
    Y = 0
    Width = 1920
    Height = 1080
}

$leftMonitor = @{
    X = 0
    Y = 0
    Width = 1920
    Height = 1080
}

# Launch applications with retries
Write-Log "Launching applications..."

# Function to launch an application if the path exists
function Launch-Application {
    param (
        [string]$AppName,
        [string]$AppPath,
        [array]$Args,
        [hashtable]$PositionParams
    )

    if (Test-Path $AppPath) {
        try {
            Write-Log "Launching application"
            Start-Process $AppPath -ArgumentList $Args
            Start-Sleep -Seconds 5
            if ($PositionParams) {
                Set-WindowPosition -ProcessName $AppName @PositionParams
            }
        } catch {
            Write-Log "Failed to launch application"
        }
    } else {
        Write-Log "Application not found"
    }
}

# Find Brave browser path
$bravePath1 = "${env:LOCALAPPDATA}\BraveSoftware\Brave-Browser\Application\brave.exe"
$bravePath2 = "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"

if (Test-Path $bravePath1) {
    $bravePath = $bravePath1
} elseif (Test-Path $bravePath2) {
    $bravePath = $bravePath2
} else {
    $bravePath = $null
    Write-Log "Browser not found in default locations"
}

$templatePath = Join-Path $scriptDir "current-status.html"
$templateUri = "file:///" + $templatePath.Replace("\", "/")

if ($bravePath) {
    try {
        Write-Log "Opening dashboard"
        Start-Process $bravePath -ArgumentList "--new-window", $templateUri
    } catch {
        Write-Log "Failed to launch browser"
    }
} else {
    try {
        Write-Log "Opening dashboard with default browser"
        Start-Process $templatePath
    } catch {
        Write-Log "Failed to open dashboard"
    }
}

# Launch Claude on left monitor
Launch-Application -AppName "claude" -AppPath $env:CLAUDE_PATH -Args @() -PositionParams $leftMonitor

# Launch Obsidian with vault on right monitor
if (-not (Get-Process -Name "Obsidian" -ErrorAction SilentlyContinue)) {
    if (Test-Path $env:OBSIDIAN_PATH) {
        try {
            Write-Log "Opening Obsidian"
            Start-Process $env:OBSIDIAN_PATH -ArgumentList "--vault", $env:OBSIDIAN_VAULT_PATH
            Start-Sleep -Seconds 5
            Set-WindowPosition -ProcessName "Obsidian" @rightMonitor
        } catch {
            Write-Log "Failed to launch Obsidian"
        }
    } else {
        Write-Log "Obsidian not found"
    }
} else {
    Write-Log "Obsidian is already running"
}

Write-Log "Setup completed"

# Try to show notification if BurntToast is available
try {
    if (Get-Module -ListAvailable -Name BurntToast) {
        Import-Module BurntToast
        New-BurntToastNotification -Text "Morning Dev Environment", "Setup completed successfully!" -AppLogo "C:\Windows\System32\SecurityAndMaintenance.png"
    }
} catch {
    Write-Log "Notification error"
}

Write-Host "Morning setup completed successfully!"
