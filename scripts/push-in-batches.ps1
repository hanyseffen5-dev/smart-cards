$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$log = Join-Path (Get-Location) ".git\batch-push.log"
function Log($msg) {
  $line = "$(Get-Date -Format 'HH:mm:ss') $msg"
  Write-Host $line
  Add-Content -Path $log -Value $line
}

Log "Starting batch push..."

$status = (git status -sb | Select-Object -First 1)
if ($status -notmatch "ahead") {
  Log "Nothing to push (expected ahead 1). Status: $status"
  exit 0
}

Log "Soft reset to origin/main..."
git reset --soft origin/main
git reset HEAD

Log "Commit 1: scripts and package.json"
git add package.json app-words.txt scripts/
git commit -m "Add Grade 5 scripts, seed data, and drive sync command."
git -c http.postBuffer=2147483648 -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=600 push --progress origin main
if ($LASTEXITCODE -ne 0) { Log "FAILED scripts push"; exit 1 }
Log "Scripts push OK"

$files = Get-ChildItem "assets/grade5_*.png" | Sort-Object Name
$batchSize = 150
$total = [Math]::Ceiling($files.Count / $batchSize)
for ($b = 0; $b -lt $total; $b++) {
  $start = $b * $batchSize
  $slice = $files[$start..([Math]::Min($start + $batchSize - 1, $files.Count - 1))]
  Log "Batch $($b + 1)/$total : $($slice.Count) images"
  git add @($slice.FullName)
  git commit -m "Add Grade 5 flashcard assets batch $($b + 1)/$total."
  git -c http.postBuffer=2147483648 -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=600 push --progress origin main
  if ($LASTEXITCODE -ne 0) { Log "FAILED batch $($b + 1)"; exit 1 }
  Log "Batch $($b + 1) OK"
}

Log "All batches pushed successfully."
