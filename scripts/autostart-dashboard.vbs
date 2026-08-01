Set WshShell = CreateObject("WScript.Shell")
' Silent launcher script for Executive Chief of Staff Dashboard
WshShell.CurrentDirectory = "C:\Users\ahalliday\.gemini\antigravity\scratch\executive-dashboard"
WshShell.Run "cmd /c npm run dev", 0, False
