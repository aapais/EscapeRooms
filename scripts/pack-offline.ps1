param(
  [string]$Out = "legacy-escape-room-offline.zip"
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Push-Location $root

if (Test-Path $Out) { Remove-Item $Out -Force }

# Excluir node_modules, score outputs, e scores recolhidos
$exclude = @(
  'node_modules',
  'score-output',
  'scores',
  '.git'
)

$tmp = Join-Path $env:TEMP ("escape-room-pack-" + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tmp | Out-Null

# Copiar tudo exceto excluídos
Get-ChildItem -Force | Where-Object {
  $name = $_.Name
  -not ($exclude -contains $name)
} | ForEach-Object {
  Copy-Item $_.FullName -Destination (Join-Path $tmp $_.Name) -Recurse -Force
}

Compress-Archive -Path (Join-Path $tmp '*') -DestinationPath $Out
Remove-Item $tmp -Recurse -Force

Pop-Location
Write-Host "Wrote: $Out"
