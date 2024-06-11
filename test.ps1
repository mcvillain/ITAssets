#!/bin/env powershell
Set-Location $PSScriptRoot
docker compose down
docker compose build
docker compose up --detach