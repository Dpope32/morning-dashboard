param([switch]$Elevated)

# Check if not admin and set execution policy
if ((Get-ExecutionPolicy -Scope CurrentUser) -ne 'RemoteSigned') {
    try {
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine -Force -ErrorAction Stop
    }
    catch {
        # If LocalMachine fails, fall back to CurrentUser
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    }
}
<# 
    ╔═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
    ║                     MORNING DEV ENVIRONMENT AUTOMATION                                                                      ║
    ║                                                                                                                             ║
    ║  What this script does:                                                                                                     ║
    ║  1. Closes non-essential applications (Chrome, Edge, VS Code, etc.)                                                         ║
    ║  2. Sets up your workspace with:                                                                                            ║
    ║     - Clean slate by closing specified applications                                                                         ║
    ║     - Morning status dashboard in Brave                                                                                     ║
    ║     - Claude on left monitor                                                                                                ║
    ║     - Opens Obsidian vault on right monitor                                                                                 ║
    ║  3. Starts Node.js server in the background                                                                                 ║
    ║  4. Starts Docker Desktop                                                                                                   ║
    ║                                                                                                                             ║                                                   
    ╚═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
#>

# Import the WindowManager module
$moduleFile = Join-Path $PSScriptRoot "modules\WindowManager.psm1"
if (Test-Path $moduleFile) {
    Import-Module $moduleFile -Force
} else {
    Write-Error "WindowManager module not found at: $moduleFile"
    exit 1
}

# Add reference to System.Windows.Forms
Add-Type -AssemblyName System.Windows.Forms

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
    AAPL_SHARES = $env:AAPL_SHARES
    MSFT_SHARES = $env:MSFT_SHARES
    TSLA_SHARES = $env:TSLA_SHARES
    AMZN_SHARES = $env:AMZN_SHARES
    NVDA_SHARES = $env:NVDA_SHARES
    GOOGL_SHARES = $env:GOOGL_SHARES
    MSTR_SHARES = $env:MSTR_SHARES
    NFLX_SHARES = $env:NFLX_SHARES
    T_SHARES = $env:T_SHARES
}

$envVariables["WEATHER_API_KEY"] = $env:WEATHER_API_KEY
$envVariables["FINNHUB_API_KEY"] = $env:FINNHUB_API_KEY

$envJson = ConvertTo-Json $envVariables -Compress
$envJsContent = "window.ENV = $envJson;`n"
$envJsContent | Out-File $envJsPath -Encoding UTF8

Write-Log "Configuration generated"

# Ask user if they want to close Claude
$closeClaudeDialogResult = [System.Windows.Forms.MessageBox]::Show("Do you want to close the Claude application?", "Close Claude", [System.Windows.Forms.MessageBoxButtons]::YesNo)

# Kill all non-essential processes
$processesToKill = @(
    "brave",
    "chrome",
    "Spotify",
    "explorer", 
    "BraveBrowser",
    "ApplicationFrameHost",
    "SystemSettings",
    "TextInputHost",
    "Code",
    "notepad",
    "slack"
)

if ($closeClaudeDialogResult -eq [System.Windows.Forms.DialogResult]::Yes) {
    $processesToKill += "claude"
}

Write-Log "Closing applications..."
foreach ($proc in $processesToKill) {
    Stop-ProcessSafely -ProcessName $proc
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

# Ask user if they want to open AWS Dashboard
$awsDialogResult = [System.Windows.Forms.MessageBox]::Show("Do you want to open AWS Dashboard?", "Open AWS Dashboard", [System.Windows.Forms.MessageBoxButtons]::YesNo)

if ($awsDialogResult -eq [System.Windows.Forms.DialogResult]::Yes) {
    Start-Process powershell -ArgumentList "-Command", "awsome" -Verb RunAs
}

$cursorPath = "${env:USERPROFILE}\AppData\Local\Programs\cursor\Cursor.exe"

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
            Write-Log "Launching $AppName at path: $AppPath"
            
            # Special handling for Cursor
            if ($AppName -eq "cursor") {
                $workingDir = Split-Path -Parent $AppPath
                $cursorProc = Start-Process $AppPath -WorkingDirectory $workingDir -ArgumentList $Args -PassThru
                Start-Sleep -Seconds 3
                
                # Verify Cursor is running
                $isRunning = Get-Process -Name "cursor" -ErrorAction SilentlyContinue
                if ($isRunning -and $PositionParams) {
                    Set-WindowPosition -ProcessName $AppName @PositionParams
                    Write-Log "Cursor positioned successfully"
                    return $true
                } else {
                    Write-Log "Cursor launch verification failed"
                    return $false
                }
            } else {
                Start-Process $AppPath -ArgumentList $Args
                Start-Sleep -Seconds 2
                if ($PositionParams) {
                    Set-WindowPosition -ProcessName $AppName @PositionParams
                }
            }
        } catch {
            Write-Log "Failed to launch $AppName : $_"
        }
    } else {
        Write-Log "$AppName not found at path: $AppPath"
    }
}

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

# Check for nanostores setup
Write-Log "Checking nanostores setup..."
$taskStoreFile = Join-Path $scriptDir "scripts\modules\taskStore.js"
if (Test-Path $taskStoreFile) {
    Write-Log "TaskStore module found"
    $taskStoreContent = Get-Content $taskStoreFile -Raw
    if ($taskStoreContent -match "nanostores") {
        Write-Log "Nanostores integration verified"
        $storageSize = (Get-Item $taskStoreFile).Length / 1KB
        Write-Log "TaskStore size: $($storageSize.ToString('0.00')) KB"
    } else {
        Write-Log "Warning: TaskStore may not be properly configured"
    }
} else {
    Write-Log "Warning: TaskStore module not found"
}

# Now open the browser pointing to the local server
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

# Claude launch section
Write-Log "Launching Claude..."
try {
    # Kill any existing Claude processes
    Get-Process -Name "claude" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Log "Terminating existing Claude process: $($_.Id)"
        $_ | Stop-Process -Force
    }
    Start-Sleep -Seconds 1

    # Clear cache
    $claudeCachePath = "$env:LOCALAPPDATA\claude\Cache"
    if (Test-Path $claudeCachePath) {
        Write-Log "Clearing Claude cache..."
        Remove-Item -Path $claudeCachePath -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    Write-Log "Starting Claude..."
    Start-Process $env:CLAUDE_PATH
    Write-Log "Waiting for Claude to initialize..."
    Start-Sleep -Seconds 3  # Give more time for initialization

    $maxAttempts = 3
    $attempt = 1
    $success = $false

    while (-not $success -and $attempt -le $maxAttempts) {
        Write-Log "Attempt $attempt to position Claude window..."
        $claudeWindow = Get-ProcessWindow -ProcessName "claude" -TimeoutSeconds 15
        if ($claudeWindow) {
            # Right monitor (DISPLAY1), left half
            $success = Move-Window -Handle $claudeWindow.MainWindowHandle `
                                -X 1920 `        # Starting X coordinate of DISPLAY1
                                -Y 11 `          # Matches DISPLAY1's Y offset
                                -Width 960 `     # Half of 1920
                                -Height 1080 `   # Full height
                                -RetryAttempts 5

            if (-not $success) {
                Write-Log "Failed positioning attempt $attempt"
                Start-Sleep -Seconds 2
            }
        } else {
            Write-Log "Failed to get window handle on attempt $attempt"
        }
        $attempt++
    }  # Added closing brace for while loop

    if ($success) {
        Write-Log "Claude window positioning completed successfully"
    } else {
        Write-Log "All positioning attempts failed"
    }
} catch {
    Write-Log "Error in Claude launch sequence: $_"
}  # Added closing brace for try block

# Function to open a new terminal with admin privileges and run a command
function Open-NewAdminTerminal {
    param (
        [string]$Command
    )
    Start-Process powershell -ArgumentList "-Command", $Command -Verb RunAs
}

# Ask user if they want to run the dev command
$dialogResult = [System.Windows.Forms.MessageBox]::Show("Do you want to run the 'dev' command?", "Run Dev Command", [System.Windows.Forms.MessageBoxButtons]::YesNo)

if ($dialogResult -eq [System.Windows.Forms.DialogResult]::Yes) {
    if (Get-Process -Name "Obsidian" -ErrorAction SilentlyContinue) {
        Write-Log "Obsidian is already running"
        # Open a new terminal with admin privileges and run the "dev" command
        Open-NewAdminTerminal -Command "dev"
    }
}

# Launch Obsidian with vault on right monitor
if (-not (Get-Process -Name "Obsidian" -ErrorAction SilentlyContinue)) {
    if (Test-Path $env:OBSIDIAN_PATH) {
        try {
            Write-Log "Opening Obsidian"
            Start-Process $env:OBSIDIAN_PATH -ArgumentList "--vault", $env:OBSIDIAN_VAULT_PATH
            Start-Sleep -Seconds 3
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

# Check if Docker is running
if (-not (Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue)) {
    $dockerPath = "C:\Program Files\Docker\Docker\frontend\Docker Desktop.exe"
    if (Test-Path $dockerPath) {
        try {
            Write-Log "Starting Docker Desktop"
            Start-Process -FilePath $dockerPath -WorkingDirectory "C:\Program Files\Docker\Docker\frontend"
        } catch {
            Write-Log "Failed to start Docker Desktop"
        }
    } else {
        Write-Log "Docker Desktop not found"
    }
} else {
    Write-Log "Docker Desktop is already running"
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
