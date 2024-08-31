#!/bin/bash

MINIO_ALIAS="minio"
MINIO_URL="http://localhost:9000"
BUCKET_NAME="shopper"
MINIO_ROOT_USER="root"
$MINIO_ROOT_PASSWORD="root1234"

mc alias set $MINIO_ALIAS $MINIO_URL $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD

if mc ls $MINIO_ALIAS/$BUCKET_NAME &>/dev/null; then
  echo "Bucket '$BUCKET_NAME' is ready to use."
else
  mc mb $MINIO_ALIAS/$BUCKET_NAME
    
  mc anonymous set public $MINIO_ALIAS/$BUCKET_NAME;

  echo "Bucket '$BUCKET_NAME' is created and ready to use."
fi