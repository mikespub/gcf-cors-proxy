/**
 * Google Cloud Functions - Basic CORS Proxy to predefined HTTPS backend server
 *
 * See https://github.com/mikespub/gcf-cors-proxy for details
 *
 * Note: the current CORS proxy is configured to access the AWS Price List API backend
 * See https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/using-ppslong.html
 */
//https://cloud.google.com/functions/docs/bestpractices/networking
const https = require('https');
const agent = new https.Agent({keepAlive: true});

const backend = 'pricing.us-east-1.amazonaws.com';

//https://github.com/firebase/functions-samples/blob/master/quickstarts/time-server/functions/index.js
// CORS Express middleware to enable CORS Requests.
//const cors = require('cors')({
//	origin: '*',
//});
var cachedAgent = function cachedAgent(req, res) {
	method = req.method || 'GET';
	path = req.path || '/offers/v1.0/aws/index.json';
	//If-Modified-Since: Sat, 05 May 2018 20:38:27 GMT
	modified = req.get('If-Modified-Since');
	//If-None-Match: "5e5d61fb71903f6b8f0123335154d11b"
	match = req.get('If-None-Match');
	headers = {};
	if (modified) {
		headers['If-Modified-Since'] = modified;
	}
	if (match) {
		headers['If-None-Match'] = match;
	}
	console.log(method + ' ' + path + ' ' + req.ips);
	reqInner = https.request({
		hostname: backend,
		port: 443,
		path: path,
		method: method,
		headers: headers,
		agent: agent
	}, resInner => {
		let rawData = '';
		resInner.setEncoding('utf8');
		resInner.on('data', chunk => { rawData += chunk; });
		resInner.on('end', () => {
			//https://expressjs.com/en/api.html#res
			res.set('Access-Control-Allow-Origin', "*");
			res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS");
			res.set('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
			// CHECKME: what about HEAD or GET 304? We need to expose Content-Length and ETag
			//https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
			res.set('Access-Control-Expose-Headers', 'Content-Length, ETag');
			//res.status(200).send(`Data: ${rawData}`);
			//if (method == 'HEAD') {
			//	console.log(resInner.headers);
			//}
			//https://nodejs.org/api/http.html#http_class_http_serverresponse
			//console.log(resInner.statusCode + ' ' + resInner.statusMessage);
			if (resInner.headers['content-length']) {
				res.set('Content-Length', resInner.headers['content-length']);
				//console.log('Content-Length: ' + resInner.headers['content-length']);
			}
			if (resInner.headers['etag']) {
				res.set('ETag', resInner.headers['etag']);
				//console.log('ETag:' + resInner.headers['etag']);
			}
			//https://cloud.google.com/functions/docs/writing/http
			if (method == 'HEAD') {
				res.status(resInner.statusCode).end();
			} else {
				if (path.endsWith('.csv')) {
					// path is /offers/v1.0/aws/<service>/<version>/index.csv
					// or /offers/v1.0/aws/<service>/<version>/<region>/index.csv
					pieces = path.split('/');
					//console.log(path + ' ' + pieces.length + ' ' + pieces);
					if (pieces.length > 7) {
						res.set('Content-Disposition', 'attachment; filename="' + pieces[4] + '.' + pieces[6] + '.csv"');
					} else {
						res.set('Content-Disposition', 'attachment; filename="' + pieces[4] + '.csv"');
					}
					res.set('Content-Type', 'application/octet-stream');
				}
				res.status(resInner.statusCode).send(rawData);
			}
		});
	});
	reqInner.on('error', e => {
		res.status(500).send(`Error: ${e.message}`);
	});
	reqInner.end();
};

/**
 * HTTP Cloud Function that uses a cached HTTP agent
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.corsAgent = (req, res) => {
	//https://mhaligowski.github.io/blog/2017/03/10/cors-in-cloud-functions.html
	//https://github.com/firebase/functions-samples/issues/288
	//var corsFn = cors();
	//corsFn(req, res, function() {
	//	cachedAgent(req, res);
	//});
	//cors(req, res, function() {
	//	cachedAgent(req, res);
	//});
	cachedAgent(req, res);
};
