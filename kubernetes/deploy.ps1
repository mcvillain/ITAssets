Set-Location $PSScriptRoot

# Create Secrets
kubectl apply -f ./backend-secrets.yml
kubectl apply -f ./frontend-tls-secrets.yml
kubectl apply -f ./registry.yml

# Create Services
kubectl apply -f ./backend-service.yml
kubectl apply -f ./frontend-service.yml

# Create Deployments
kubectl apply -f ./backend.yml
kubectl apply -f ./frontend.yml