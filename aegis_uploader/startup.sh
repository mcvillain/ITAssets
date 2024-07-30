#!/bin/sh
mount -t cifs $SMB_PATH /mnt/uploads -o user=$SMB_USER,password=$SMB_PASS,dir_mode=0777,file_mode=0777,serverino,nosharesock,actimeo=30
node index.js