param(
  [Parameter(Mandatory=$true)]
  [string]$InDir
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Push-Location $root

if (-not (Test-Path $InDir)) {
  throw "Input dir not found: $InDir"
}

New-Item -ItemType Directory -Path .\scores -Force | Out-Null

# Expect files like: <InDir>\TeamName\score.json OR <InDir>\TeamName\score-output\score.json
Get-ChildItem -Path $InDir -Directory | ForEach-Object {
  $team = $_.Name
  $direct = Join-Path $_.FullName 'score.json'
  $nested = Join-Path $_.FullName 'score-output\score.json'

  $src = $null
  if (Test-Path $direct) { $src = $direct }
  elseif (Test-Path $nested) { $src = $nested }

  if ($src) {
    $destDir = Join-Path $root ("scores\\$team\\score-output")
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    Copy-Item $src (Join-Path $destDir 'score.json') -Force
    Write-Host "Ingested: $team"
  }
}

npm run leaderboard
Pop-Location
