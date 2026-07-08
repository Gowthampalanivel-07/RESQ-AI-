# ResQAI Strategic Command Launcher
# Starts both the FastAPI Backend and Next.js Frontend

Write-Host "INITIALIZING RESQAI NEURAL CORE..." -ForegroundColor Cyan

# Start Backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location backend; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000" -WindowStyle Normal

Write-Host "INTELLIGENCE LAYER ACTIVE @ http://localhost:8000" -ForegroundColor Green

# Start Frontend in current window
Write-Host "LAUNCHING STRATEGIC HUD..." -ForegroundColor Cyan
Set-Location frontend
npm run dev
