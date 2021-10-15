# Google Cloud Functions - Basic CORS Proxy

This cloud function provides a basic CORS proxy to a predefined HTTPS backend server.

See:

* Cloud Functions [Hello World tutorial][tutorial]
* Cloud Functions [CORS Proxy sample source code][code]

[tutorial]: https://cloud.google.com/functions/docs/quickstart
[code]: index.js

## Deploy and run the sample

See the Cloud Functions [Hello World tutorial][tutorial].

## Deploy using the gcloud tool

See [Deploying Cloud Functions][deploying] using the gcloud tool from your [filesystem][filesystem] or [repository][repo]

```
$ gcloud functions deploy corsAgent --trigger-http --runtime nodejs14 --allow-unauthenticated
```

[deploying]: https://cloud.google.com/functions/docs/deploying/
[filesystem]: https://cloud.google.com/functions/docs/deploying/filesystem#deploy_using_the_gcloud_tool
[repo]: https://cloud.google.com/functions/docs/deploying/repo#deploy_using_the_gcloud_tool
