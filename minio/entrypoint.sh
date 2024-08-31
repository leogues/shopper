#!/bin/sh

/usr/bin/minio server /data --console-address ":9001" &

sleep 1

sh /setup.sh

wait
