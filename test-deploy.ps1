Set-Location $PSScriptRoot

Write-Output "Preparing Images for Building"
Copy-Item .\environment\dev_frontend.env .\frontend\.env.production

Write-Output "Building Images"
docker compose build

Write-Output "Cleaning Up Build"
Remove-Item .\frontend\.env.production

Write-Output "Exporting Compiled Images"
docker image save -o frontend.tar itassets-frontend:latest
docker image save -o backend.tar itassets-backend:latest

Write-Output "Copying Images to Production Server"
ssh agsheeran@192.168.254.10 "mkdir -p ~/tmp"
scp ./backend.tar agsheeran@192.168.254.10:~/tmp
scp ./frontend.tar agsheeran@192.168.254.10:~/tmp

Write-Output "Bringing Down Production Server in 5..."
Start-Sleep -Seconds 1
Write-Output "4..."
Start-Sleep -Seconds 1
Write-Output "3..."
Start-Sleep -Seconds 1
Write-Output "2..."
Start-Sleep -Seconds 1
Write-Output "1..."
Start-Sleep -Seconds 1
ssh agsheeran@192.168.254.10 "mkdir -p ~/itassets/ && cd ~/itassets && if [ -f ~/itassets/compose.yml ]; then docker compose down && rm -f ~/itassets/compose.yml; fi"

Write-Output "Copying compose.yml to Production Server"
scp ./compose-deploy.yml agsheeran@192.168.254.10:~/itassets/compose.yml

Write-Output "Loading New Images on Production Server"
ssh agsheeran@192.168.254.10 "docker image rm backend:latest ; docker load -i ~/tmp/backend.tar && docker image rm frontend:latest ; docker load -i ~/tmp/frontend.tar"

Write-Output "Starting Production Server"
ssh agsheeran@192.168.254.10 "rm -R ~/tmp && cd ~/itassets/ && docker compose up --detach"

Write-Output "Clearing Image Tarballs"
Remove-Item ./frontend.tar
Remove-Item ./backend.tar

Write-Output "Done."