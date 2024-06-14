Set-Location $PSScriptRoot
Write-Output "Building Images"
docker compose build

Write-Output "Exporting Compiled Images"
docker image save -o frontend.tar itassets-frontend:latest
docker image save -o backend.tar itassets-backend:latest

Write-Output "Copying Images to Production Server"
ssh agsheeran@74.235.254.31 "mkdir -p ~/tmp"
scp ./backend.tar agsheeran@74.235.254.31:~/tmp
scp ./frontend.tar agsheeran@74.235.254.31:~/tmp

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
ssh agsheeran@74.235.254.31 "mkdir -p ~/itassets/ && cd ~/itassets && if [ -f ~/itassets/compose.yml ]; then docker compose down && rm -f ~/itassets/compose.yml; fi"

Write-Output "Copying compose.yml to Production Server"
scp ./compose-deploy.yml agsheeran@74.235.254.31:~/itassets/compose.yml

Write-Output "Loading New Images on Production Server"
ssh agsheeran@74.235.254.31 "docker image rm itassets-frontend:latest ; docker load -i ~/tmp/backend.tar && docker image rm itassets-frontend:latest ; docker load -i ~/tmp/frontend.tar"

Write-Output "Starting Production Server"
ssh agsheeran@74.235.254.31 "rm -R ~/tmp && cd ~/itassets/ && docker compose up --detach"

Write-Output "Clearing Image Tarballs"
Remove-Item ./frontend.tar
Remove-Item ./backend.tar

Write-Output "Done."