#!/bin/env powershell
Set-Location $PSScriptRoot
docker compose down
Copy-Item .\environment\dev_frontend.env .\frontend\.env.production
docker compose build
Remove-Item .\frontend\.env.production
docker compose up --detach