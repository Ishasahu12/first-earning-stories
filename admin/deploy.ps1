# Simple Deployment Script
# Run this in terminal: .

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Deploy First Earning Stories Admin" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if wrangler is installed
$wrangler = Get-Command npx -ErrorAction SilentlyContinue
if (-not $wrangler) {
    Write-Host "ERROR: npm/npx not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Deploy admin panel
Write-Host "Deploying admin panel..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot"

# Try to deploy
try {
    npx wrangler pages deploy . --project-name=first-earning-admin
    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "  Admin Panel Deployed Successfully!" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "URL: https://first-earning-admin.pages.dev" -ForegroundColor White
    Write-Host "Password: FESadmin2024!" -ForegroundColor White
    Write-Host ""
    Write-Host "IMPORTANT: Change the password after first login!" -ForegroundColor Yellow
} catch {
    Write-Host ""
    Write-Host "ERROR: Deployment failed" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Yellow
    Write-Host "1. Run 'npx wrangler login' first" -ForegroundColor White
    Write-Host "2. Create project in Cloudflare dashboard first" -ForegroundColor White
    Write-Host "3. Make sure you're using the right Cloudflare account" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
