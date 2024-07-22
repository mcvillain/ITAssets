Set-Location $PSScriptRoot

Write-Output "Generating Upload Coordinator Signing Keys..."
New-Item -Path ./coordinator_signing -ItemType Directory -Force
openssl genrsa -out ./coordinator_signing/tls.key 2048
Write-Output @"
US
PA
Horsham
AISCORP
IT
localhost
helpdesk@aiscorp.com
"@ | openssl req -key ./coordinator_signing/tls.key -new -x509 -days 365 -out ./coordinator_signing/tls.crt

Write-Output "Generating Uploader Signing Keys..."
New-Item -Path ./uploader_signing -ItemType Directory -Force
openssl genrsa -out ./uploader_signing/tls.key 2048
Write-Output @"
US
PA
Horsham
AISCORP
IT
localhost
helpdesk@aiscorp.com
"@ | openssl req -key ./uploader_signing/tls.key -new -x509 -days 365 -out ./uploader_signing/tls.crt
