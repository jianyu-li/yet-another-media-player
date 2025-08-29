# PowerShell script to build alpha version and copy to Home Assistant config
# This script does everything in one go

Write-Host "🔨 Building alpha version..." -ForegroundColor Cyan

# Set environment variable and build
$env:BRANCH = "alpha"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully" -ForegroundColor Green

# Now copy to Home Assistant config
$SourceFile = "yet-another-media-player-alpha.js"
$TargetDir = "/Volumes/config/www"
$TargetFile = "$TargetDir/yet-another-media-player-alpha.js"

Write-Host "📁 Copying alpha file to Home Assistant config..." -ForegroundColor Cyan

# Check if source file exists
if (-not (Test-Path $SourceFile)) {
    Write-Host "❌ Source file $SourceFile not found!" -ForegroundColor Red
    Write-Host "💡 Build may have failed or output file has different name" -ForegroundColor Yellow
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
    Write-Host "🎉 Build and copy completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to copy file to $TargetFile" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
