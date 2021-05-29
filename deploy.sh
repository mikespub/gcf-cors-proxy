#!/bin/sh
gcloud functions deploy corsAgent --trigger-http --runtime nodejs12 --allow-unauthenticated
# gcloud functions describe corsAgent
