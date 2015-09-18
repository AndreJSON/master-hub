/*jslint node: true */
'use strict';
var http = require('http');

var apiKey = {};
apiKey['travelplannerV2/trip'] = '82bc3353d3cf48f69b33b58017d5d32b';
apiKey['realtimedepartures'] = 'fdd1293b533e4bc5b2f453b618b1ffd2';
apiKey['deviations'] = '20a939c9478c4c999f236e8a9bd8f9f7';

module.exports = function (app) {

	app.get('/api/catch-it/:apiname/:parameters', function (req, res) {
		if (req.params.apiname === 'travelplannerV2-trip') {
			req.params.apiname = 'travelplannerV2/trip';
		}
		http.get({host: 'api.sl.se', path: '/api2/' + req.params.apiname + '.json?key=' + apiKey[req.params.apiname] + '&' + req.params.parameters}, function (response) {
			// Continuously update stream with data
			var body = '';
			response.on('data', function (d) {
				body += d;
			});
			response.on('end', function () {
				var parsed = JSON.parse(body);
				res.json(parsed);
			});
		});
	});
};