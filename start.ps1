# Script de demarrage de l'application Cyber Solution
# Lance le backend (port 3001) et le frontend (port 3000)

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "    CYBER SOLUTION - STARTUP SCRIPT" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Verifier si des processus utilisent deja les ports
Write-Host "Verification des ports 3000 et 3001..." -ForegroundColor Yellow

$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue

if ($port3000 -or $port3001) {
    Write-Host "ATTENTION: Des processus utilisent deja les ports !" -ForegroundColor Red
    
    if ($port3000) {
        $pid3000 = $port3000.OwningProcess
        Write-Host "   Port 3000 utilise par PID: $pid3000" -ForegroundColor Yellow
    }
    
    if ($port3001) {
        $pid3001 = $port3001.OwningProcess
        Write-Host "   Port 3001 utilise par PID: $pid3001" -ForegroundColor Yellow
    }
    
    $response = Read-Host "`nVoulez-vous tuer ces processus et continuer ? (O/N)"
    
    if ($response -eq "O" -or $response -eq "o") {
        if ($port3000) {
            Stop-Process -Id $pid3000 -Force -ErrorAction SilentlyContinue
            Write-Host "Processus sur port 3000 arrete" -ForegroundColor Green
        }
        if ($port3001) {
            Stop-Process -Id $pid3001 -Force -ErrorAction SilentlyContinue
            Write-Host "Processus sur port 3001 arrete" -ForegroundColor Green
        }
        Start-Sleep -Seconds 2
    } else {
        Write-Host "`nDemarrage annule.`n" -ForegroundColor Red
        exit
    }
}

Write-Host "`nPorts disponibles !`n" -ForegroundColor Green

# Demarrer le backend
Write-Host "Demarrage du serveur BACKEND (port 3001)..." -ForegroundColor Cyan
$backendPath = "c:\Users\SCD UM\Downloads\cyber-solution\server"

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$backendPath'; Write-Host '`n=== BACKEND SERVER (port 3001) ===' -ForegroundColor Blue; Write-Host '========================================`n' -ForegroundColor Blue; npx tsx index.ts"
)

Start-Sleep -Seconds 2

# Demarrer le frontend
Write-Host "Demarrage du serveur FRONTEND (port 3000)..." -ForegroundColor Cyan
$frontendPath = "c:\Users\SCD UM\Downloads\cyber-solution"

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$frontendPath'; Write-Host '`n=== FRONTEND SERVER (port 3000) ===' -ForegroundColor Magenta; Write-Host '========================================`n' -ForegroundColor Magenta; npm run dev"
)

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "         APPLICATION DEMARREE !" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""

Write-Host "URLs d'acces :" -ForegroundColor Yellow
Write-Host "   Frontend: " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend:  " -NoNewline
Write-Host "http://localhost:3001" -ForegroundColor Cyan

Write-Host "`nConseils :" -ForegroundColor Yellow
Write-Host "   - Ouvrez http://localhost:3000 dans votre navigateur"
Write-Host "   - Les serveurs tournent dans des fenetres PowerShell separees"
Write-Host "   - Fermez les fenetres PowerShell pour arreter les serveurs"
Write-Host "   - Consultez les logs dans les fenetres respectives"

Write-Host "`nPour relancer : " -NoNewline
Write-Host ".\start.ps1" -ForegroundColor Cyan
Write-Host ""

# Attendre avant de fermer
Write-Host "Appuyez sur une touche pour fermer ce terminal..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
