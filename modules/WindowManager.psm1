# WindowManager.psm1
using namespace System.Runtime.InteropServices

# Define the Win32 API functions
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
        
        [DllImport("user32.dll")]
        public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);

        [DllImport("user32.dll")]
        public static extern bool CloseWindow(IntPtr hWnd);
        
        [StructLayout(LayoutKind.Sequential)]
        public struct RECT
        {
            public int Left;
            public int Top;
            public int Right;
            public int Bottom;
        }
    }
"@

# Constants
$script:SW_RESTORE = 9
$script:SW_MAXIMIZE = 3
$script:SWP_SHOWWINDOW = 0x0040

function Get-ProcessWindow {
    param (
        [string]$ProcessName,
        [int]$TimeoutSeconds = 10,
        [int]$RetryInterval = 500  # milliseconds
    )
    
    $startTime = Get-Date
    while ($true) {
        $processes = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
        
        foreach ($proc in $processes) {
            if ($proc.MainWindowHandle -ne 0) {
                return $proc
            }
        }
        
        if (((Get-Date) - $startTime).TotalSeconds -gt $TimeoutSeconds) {
            return $null
        }
        Start-Sleep -Milliseconds $RetryInterval
    }
}

function Stop-ProcessSafely {
    param (
        [string]$ProcessName,
        [int]$WaitSeconds = 2
    )
    
    $processes = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    
    foreach ($proc in $processes) {
        try {
            if ($proc.MainWindowHandle -ne 0) {
                [Win32]::CloseWindow($proc.MainWindowHandle)
            }
            if (!$proc.WaitForExit($WaitSeconds * 1000)) {
                $proc.Kill()
            }
        } catch {
            Write-Error "Failed to close $ProcessName process: $_"
        }
    }
}

function Move-Window {
    param (
        [IntPtr]$Handle,
        [int]$X,
        [int]$Y,
        [int]$Width,
        [int]$Height,
        [int]$RetryAttempts = 1,
        [int]$RetryDelay = 1  # seconds
    )
    
    for ($i = 0; $i -lt $RetryAttempts; $i++) {
        try {
            [Win32]::SetForegroundWindow($Handle) | Out-Null
            Start-Sleep -Seconds 1
            
            [Win32]::ShowWindow($Handle, $script:SW_RESTORE) | Out-Null
            Start-Sleep -Milliseconds 500
            
            [Win32]::SetWindowPos($Handle, [IntPtr]::Zero, $X, $Y, $Width, $Height, $script:SWP_SHOWWINDOW) | Out-Null
            Start-Sleep -Milliseconds 500
            
            [Win32]::ShowWindow($Handle, $script:SW_MAXIMIZE) | Out-Null
            return $true
        } catch {
            Write-Error "Attempt $($i + 1) failed to move window: $_"
            if ($i -lt $RetryAttempts - 1) {
                Start-Sleep -Seconds $RetryDelay
            }
        }
    }
    return $false
}

Export-ModuleMember -Function Get-ProcessWindow, Move-Window, Stop-ProcessSafely