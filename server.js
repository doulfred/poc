var express = require('express');
var app = express.createServer(express.logger());
var url = require("url");
var io = require('socket.io').listen(app);

var port = process.env.PORT || 5000;


// exportation de la fonction de lancement du serveur
exports.start = start;
exports.io = io;

//start();

// Module de lancement : pour une conception evenementielle
function start(route, handle) {
	/*
	app.get('/', function (req, res) {
		console.log("Requête reçue pour le chemin." + __dirname);
		res.sendfile(__dirname + '/public/index.html');
	});
	*/
	app.use("/public", express.static(__dirname + '/public'));


	
	for(var attributename in handle){
		console.log(attributename/*+": "+handle[attributename]*/);
		app.get(attributename, function (request, response) {
			console.log("Requête reçue pour le chemin "+attributename+".");
			//handle[attributename](response, request);
			var pathname = url.parse(request.url).pathname;
			route(handle, pathname, response, request);
		});
	}
	
	app.post('/upload', function (req, res) {
		console.log("Requête reçue pour le chemin.");
		handle["/upload"](res, req);
	});
	
	
	
	
	// assuming io is the Socket.IO server object
	io.configure(function () { 
		io.set("transports", ["xhr-polling"]); 
		io.set("polling duration", 1); 
	});
	app.listen(port, function() {
	  console.log("Listening on " + port);
	});
	
}

