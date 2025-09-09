@echo off
powershell -NoProfile -Command "$env:NODE_ENV='development'; Set-Location '%~dp0'; npx tsx server/index.ts"