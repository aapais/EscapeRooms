param(
  [switch]$Strict
)

$ErrorActionPreference = 'Stop'

Write-Host "Preflight: Node + npm" 
node --version
npm --version

Write-Host "Preflight: install" 
npm install

Write-Host "Preflight: score" 
if ($Strict) {
  npm run score:strict
} else {
  npm run score
}
