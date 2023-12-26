#!/bin/sh
gcloud functions deploy corsAgent --trigger-http --runtime nodejs18 --allow-unauthenticated
# gcloud functions describe corsAgent
