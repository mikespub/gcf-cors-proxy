#!/bin/sh
gcloud functions deploy corsAgent --trigger-http --runtime nodejs8
