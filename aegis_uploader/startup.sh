#!/bin/sh
mount -t cifs $SMB_PATH /mnt/uploads -o user=$SMB_USER,password=$SMB_PASS,dir_mode=0777,file_mode=0777,serverino,nosharesock,actimeo=30
#NODE_EXTRA_CA_CERTS=node_modules/node_extra_ca_certs_mozilla_bundle/ca_bundle/ca_intermediate_root_bundle.pem
node index.js
