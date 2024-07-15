#!/bin/sh
gcloud functions deploy corsAgent --trigger-http --runtime nodejs20 --allow-unauthenticated
# gcloud functions describe corsAgent
