#!/bin/bash
echo "Generating Upload Coordinator Signing Keys..."
mkdir -p ./coordinator_signing
openssl genrsa -out ./coordinator_signing/tls.key 2048
cat << EOF
US
PA
Horsham
AISCORP
IT
localhost
helpdesk@aiscorp.com
EOF | openssl req -key ./coordinator_signing/tls.key -new -x509 -days 365 -out ./coordinator_signing/tls.crt

echo "Generating Uploader Signing Keys..."
mkdir -p ./coordinator_signing
openssl genrsa -out ./uploader_signing/tls.key 2048
cat << EOF
US
PA
Horsham
AISCORP
IT
localhost
helpdesk@aiscorp.com
EOF | openssl req -key ./uploader_signing/tls.key -new -x509 -days 365 -out ./uploader_signing/tls.crt
