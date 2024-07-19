Set-Location $PSScriptRoot

# Create Volumes
kubectl apply -f ./mariadb-data-volume.yml
kubectl apply -f ./mariadb-data.yml

Start-Sleep -Seconds 2

# Create Secrets
kubectl apply -f ./mariadb-secrets.yml
Start-Sleep -Seconds 2

# Create Services
kubectl apply -f ./mariadb-service.yml
Start-Sleep -Seconds 2

kubectl apply -f ./mariadb.yml
Start-Sleep -Seconds 2