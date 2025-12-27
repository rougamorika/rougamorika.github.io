Set WshShell = CreateObject("WScript.Shell")
ScriptDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run "cmd /c cd /d """ & ScriptDir & """ && 启动博客.bat", 0, False
MsgBox "Blog dev server is starting in background..." & vbCrLf & vbCrLf & _
       "Frontend: http://localhost:5173" & vbCrLf & _
       "Backend: http://localhost:3001" & vbCrLf & vbCrLf & _
       "Browser will open in 3 seconds" & vbCrLf & vbCrLf & _
       "To stop: run 停止博客.bat or kill node.exe in Task Manager", _
       vbInformation, "Blog Starting"
Set WshShell = Nothing
