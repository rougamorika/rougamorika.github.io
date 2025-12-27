Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Create Blog Shortcut" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TargetPath = Join-Path $ScriptDir "start-blog.bat"

if (-not (Test-Path $TargetPath)) {
    Write-Host "[Error] Startup script not found: $TargetPath" -ForegroundColor Red
    Write-Host "Please ensure 'start-blog.bat' exists in the same directory" -ForegroundColor Yellow
    pause
    exit 1
}

$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $DesktopPath "Start Blog.lnk"

$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.WorkingDirectory = $ScriptDir
$Shortcut.Description = "Double-click to start blog dev server"
$Shortcut.WindowStyle = 1

$IconPath = Join-Path $ScriptDir "public\favicon.ico"
if (Test-Path $IconPath) {
    $Shortcut.IconLocation = $IconPath
    Write-Host "[Info] Custom icon set" -ForegroundColor Green
} else {
    $Shortcut.IconLocation = "%SystemRoot%\System32\cmd.exe,0"
    Write-Host "[Info] Using default icon (favicon.ico not found)" -ForegroundColor Yellow
}

$Shortcut.Save()

Write-Host ""
Write-Host "[Success] Shortcut created: $ShortcutPath" -ForegroundColor Green
Write-Host ""
