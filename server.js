/*jslint node: true, nomen: true, es5: true*/

'use strict';

var express        = require('express');
var app            = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var port = 8080;

require('./app/routes')(app); // configure our routes
app.use(express.static(__dirname + '/public'));
app.listen(port);

//Connect to the database.
mongoose.connect('mongodb://localhost/master');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to the database!'));
db.once('open', function (callback) {
	console.log('Connection to database is open!');
});

console.log("Server up and running on port: " + port);