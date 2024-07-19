Set-Location $PSScriptRoot

kubectl delete -f ./mariadb.yml
kubectl delete -f ./mariadb-service.yml
kubectl delete -f ./mariadb-secrets.yml
kubectl delete -f ./mariadb-data.yml
kubectl delete -f ./mariadb-data-volume.yml