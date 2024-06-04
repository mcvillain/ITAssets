##################################################################
#################### This Script Requires SED ####################
##################################################################
# Get it here: https://gnuwin32.sourceforge.net/packages/sed.htm #
##################################################################

# Generate new version
Set-Variable -Name "random" -Value (Get-Random) -Option constant
Write-Output ("Generated random number: " + $random)
Set-Alias -Name sed -Value C:\"Program Files"\Git\usr\bin\sed.exe
# Pull
Write-Output "Updating Repo"
Set-Location $PSScriptRoot/../
git fetch origin
git reset --hard origin/main
git pull
# Clear Old
Write-Output "Clearing Old Images"
Set-Location $PSScriptRoot/../builders
Remove-Item ./*.tar
docker rm backend_ctr --force
docker image rm backend
docker rm frontend_ctr --force
docker image rm frontend

# Backend
Write-Output "Building Backend"
Set-Location $PSScriptRoot/backend
sed -i ('s/ENV VERSION = RANDOM_NUM/ENV VERSION = ' + $random +  ' /g') Dockerfile
Copy-Item $PSScriptRoot/../backend/src/package.json .
docker build -t backend .
# docker image save -o backend.tar backend:latest
# Move-Item ./backend.tar ..
# Remove-Item ./package.json

# Frontend
Write-Output "Building Frontend"
Set-Location $PSScriptRoot/frontend
sed -i ('s/ENV VERSION = RANDOM_NUM/ENV VERSION = ' + $random +  ' /g') Dockerfile
docker build -t frontend .
# docker image save -o frontend.tar frontend:latest
# Move-Item ./frontend.tar ..

# Deploy
Write-Output Deploying...
Set-Location $PSScriptRoot
docker run -d -p 3030:3000 --restart=always --name backend_ctr backend:latest
docker run -d -p 8080:80 --restart=always -e NODE_ENV='development' -e VITE_API_ENDPOINT='http://localhost:3030' --name frontend_ctr frontend:latest

# ssh jared@4.246.161.216 "rm /tmp/*.tar"
# scp ./backend.tar jared@4.246.161.216:/tmp
# scp ./frontend.tar jared@4.246.161.216:/tmp
# Write-Output "Deploying Backend..."
# ssh jared@4.246.161.216 "docker rm backend_ctr --force ; docker image rm backend ; docker load -i /tmp/backend.tar ; docker run -d -p 3030:3000 --restart=always --name backend_ctr backend:latest"
# Write-Output "Deploying Frontend..."
# ssh jared@4.246.161.216 ""

# Reset Changes to Dockerfiles
Write-Output "Reverting Dockerfile Changes"
Set-Location $PSScriptRoot/..
git fetch origin
git reset --hard origin/main
git pull
# Done
Set-Location $PSScriptRoot
Write-Output "DONE!"
