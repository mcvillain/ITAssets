Set-Location $PSScriptRoot

kubectl delete -f ./frontend.yml
kubectl delete -f ./backend.yml
kubectl delete -f ./frontend-service.yml
kubectl delete -f ./backend-service.yml
kubectl delete -f ./registry.yml
kubectl delete -f ./frontend-tls-secrets.yml
kubectl delete -f ./backend-secrets.yml