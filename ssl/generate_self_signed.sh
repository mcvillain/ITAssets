#!/bin/bash
openssl genrsa -out domain.key 2048
openssl req -key domain.key -new -x509 -days 365 -out domain.crt