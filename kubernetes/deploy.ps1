Set-Location $PSScriptRoot

# Create Volumes
kubectl apply -f ./mariadb-data-volume.yml
kubectl apply -f ./mariadb-data.yml

Start-Sleep -Seconds 2

# Create Secrets
kubectl apply -f ./mariadb-secrets.yml
kubectl apply -f ./backend-secrets.yml
kubectl apply -f ./frontend-tls-secrets.yml
kubectl apply -f ./registry.yml
Start-Sleep -Seconds 2

# Create Services
kubectl apply -f ./mariadb-service.yml
kubectl apply -f ./backend-service.yml
kubectl apply -f ./frontend-service.yml
Start-Sleep -Seconds 2

# Create StatefulSets
kubectl apply -f ./mariadb.yml
Start-Sleep -Seconds 2

# Create Deployments
kubectl apply -f ./backend.yml
kubectl apply -f ./frontend.yml