#!/bin/sh
gcloud functions deploy corsAgent --trigger-http --runtime nodejs16 --allow-unauthenticated
# gcloud functions describe corsAgent
