#!/bin/bash
openssl genrsa -out ./frontend_https/domain.key 2048
cat << EOF
US
PA
Horsham
AISCORP
IT
localhost
helpdesk@aiscorp.com
EOF | openssl req -key ./frontend_https/domain.key -new -x509 -days 365 -out ./frontend_https/domain.crt