#!/usr/bin/env bash
# 服务器 / Git Bash 上打包：生成后端 jar 并复制到 deploy/server/
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"

cd "$root/resume-server"
mvn clean package -DskipTests

cp resume-web/target/resume-web.jar "$root/deploy/server/resume-web.jar"
echo "OK: deploy/server/resume-web.jar"
