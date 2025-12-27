# 博客快捷方式创建脚本
# 此脚本会在桌面创建一个快捷方式，可以固定到任务栏

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   创建博客启动快捷方式" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 获取脚本所在目录
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 快捷方式目标文件
$TargetPath = Join-Path $ScriptDir "启动博客.bat"

# 检查目标文件是否存在
if (-not (Test-Path $TargetPath)) {
    Write-Host "[错误] 未找到启动脚本: $TargetPath" -ForegroundColor Red
    Write-Host "请确保 '启动博客.bat' 文件存在于同一目录" -ForegroundColor Yellow
    pause
    exit 1
}

# 桌面路径
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $DesktopPath "启动博客.lnk"

# 创建 WScript.Shell 对象
$WshShell = New-Object -ComObject WScript.Shell

# 创建快捷方式
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.WorkingDirectory = $ScriptDir
$Shortcut.Description = "双击启动博客开发服务器"
$Shortcut.WindowStyle = 1  # 1 = 正常窗口

# 尝试设置图标（如果项目中有图标文件）
$IconPath = Join-Path $ScriptDir "public\favicon.ico"
if (Test-Path $IconPath) {
    $Shortcut.IconLocation = $IconPath
    Write-Host "[信息] 已设置自定义图标" -ForegroundColor Green
} else {
    # 使用默认的 cmd 图标
    $Shortcut.IconLocation = "%SystemRoot%\System32\cmd.exe,0"
    Write-Host "[信息] 使用默认图标（未找到 favicon.ico）" -ForegroundColor Yellow
}

# 保存快捷方式
$Shortcut.Save()

Write-Host ""
Write-Host "[成功] 快捷方式已创建: $ShortcutPath" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "使用说明:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. 双击桌面上的 '启动博客' 快捷方式即可启动" -ForegroundColor White
Write-Host "2. 右键快捷方式 -> 固定到任务栏，可快速访问" -ForegroundColor White
Write-Host "3. 右键快捷方式 -> 属性 -> 更改图标，可自定义图标" -ForegroundColor White
Write-Host ""

# 询问是否打开桌面文件夹
$Response = Read-Host "是否打开桌面查看快捷方式？(Y/N)"
if ($Response -eq "Y" -or $Response -eq "y") {
    explorer.exe $DesktopPath
}

Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
