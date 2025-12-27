========================================
  Blog Startup Scripts - Usage Guide
========================================

Created Files:
  - start-blog.bat          Main startup script (Recommended)
  - start-blog-silent.vbs   Silent startup (no console window)
  - stop-blog.bat           Stop the dev server
  - create-shortcut.ps1     Create desktop shortcut

========================================
Quick Start
========================================

Method 1: Double-click "start-blog.bat" (Recommended)
  - Shows console window with logs
  - Auto-checks Node.js and dependencies
  - Opens browser after 3 seconds
  - Best for daily use and debugging

Method 2: Double-click "start-blog-silent.vbs"
  - Runs in background (no console window)
  - Cleaner interface
  - Shows popup notification
  - Good if you don't want to see the console

Method 3: Create desktop shortcut
  - Right-click "create-shortcut.ps1" -> Run with PowerShell
  - Creates shortcut on desktop
  - Can pin to taskbar for quick access

========================================
Stop the Server
========================================

Method 1: Press Ctrl+C in console window (Recommended)
Method 2: Double-click "stop-blog.bat"
Method 3: Close the console window
Method 4: Kill node.exe in Task Manager

========================================
Access URLs
========================================

Frontend: http://localhost:5173
Backend:  http://localhost:3001

Browser will auto-open frontend after 3 seconds

========================================
Pin to Taskbar
========================================

1. Right-click "start-blog.bat" -> Send to -> Desktop
2. Right-click desktop shortcut -> Pin to taskbar
3. Click taskbar icon to start anytime

========================================
Troubleshooting
========================================

Q: Nothing happens when I double-click?
A: Check if Node.js is installed. Run "start-blog.bat" to see errors

Q: Port already in use?
A: Double-click "stop-blog.bat" to stop previous server

Q: VBS script won't run?
A: Right-click -> Properties -> Unblock, or use BAT script

Q: Want to see logs?
A: Use "start-blog.bat" instead of VBS script

Q: How to update blog content?
A: Just edit files after starting server, Vite auto-reloads

========================================
Tips
========================================

- First run may take a few minutes to install dependencies
- Keep console window open, closing stops the server
- Code changes auto-refresh, no restart needed
- Pin shortcut to taskbar for quick access

========================================
