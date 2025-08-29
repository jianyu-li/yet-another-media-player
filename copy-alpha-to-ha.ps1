# PowerShell script to copy alpha build file to Home Assistant config
# Run this script after building the alpha version

$SourceFile = "yet-another-media-player-alpha.js"
$TargetDir = "/Volumes/config/www"
$TargetFile = "$TargetDir/yet-another-media-player-alpha.js"

Write-Host "📁 Copying alpha file to Home Assistant config..." -ForegroundColor Cyan

# Check if source file exists
if (-not (Test-Path $SourceFile)) {
    Write-Host "❌ Source file $SourceFile not found!" -ForegroundColor Red
    Write-Host "💡 Make sure you've built the alpha version first:" -ForegroundColor Yellow
    Write-Host "   `$env:BRANCH='alpha'; npm run build" -ForegroundColor Yellow
    exit 1
}

# Check if target directory exists
if (-not (Test-Path $TargetDir)) {
    Write-Host "❌ Target directory $TargetDir not found!" -ForegroundColor Red
    Write-Host "💡 Make sure your Home Assistant config directory is mounted correctly" -ForegroundColor Yellow
    exit 1
}

# Copy the file
try {
    Copy-Item -Path $SourceFile -Destination $TargetFile -Force
    Write-Host "✅ Successfully copied $SourceFile to $TargetFile" -ForegroundColor Green
    Write-Host "🔄 Home Assistant should automatically reload the file" -ForegroundColor Cyan
    Write-Host "🧪 You can now test the alpha version in Home Assistant" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to copy file to $TargetFile" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
