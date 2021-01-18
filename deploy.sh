#!/bin/sh
gcloud functions deploy corsAgent --trigger-http --runtime nodejs10 --allow-unauthenticated
# gcloud functions describe corsAgent
