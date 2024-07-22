Set-Location $PSScriptRoot

openssl genrsa -out ./frontend_https/domain.key 2048
Write-Output @"
US
PA
Horsham
AISCORP
IT
localhost
helpdesk@aiscorp.com
"@ | openssl req -key ./frontend_https/domain.key -new -x509 -days 365 -out ./frontend_https/domain.crt