# 本地（Windows）打包：生成后端 jar 并复制到 deploy/server/
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$server = Join-Path $root "resume-server"

Push-Location $server
try {
    mvn clean package -DskipTests
}
finally {
    Pop-Location
}

Copy-Item (Join-Path $server "resume-web\target\resume-web.jar") (Join-Path $PSScriptRoot "server\resume-web.jar") -Force
Write-Host "OK: deploy/server/resume-web.jar"
