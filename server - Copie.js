//var http = require("http");
var express = require("express"), 
	app = express.createServer(),
	url = require("url");


// Module de lancement : pour une conception evenementielle
function start(route, handle) {
	
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log("Requête reçue pour le chemin " + pathname + ".");
		// on transmet les "actions" + chemin
		//route(handle, pathname, response, request);
	}
	
	//http.createServer(onRequest).listen(5000);
	app.listen(process.env.C9_PORT || 5000);
	
	/*
	app.get('/', function (req, res) {
		console.log("Requête reçue pour le chemin.");
		res.sendfile(__dirname + '/public/index.html');
	});
	*/
	
	
	for(var attributename in handle){
		console.log(attributename/*+": "+handle[attributename]*/);
		app.get(attributename, function (request, response) {
			console.log("Requête reçue pour le chemin "+attributename+".");
			//handle[attributename](response, request);
			var pathname = url.parse(request.url).pathname;
			route(handle, pathname, response, request);
		});
	}
	/*
	app.get('/', function (req, res) {
		console.log("Requête reçue pour le chemin.");
		handle["/"](res, req);
	});
	*/
	app.post('/upload', function (req, res) {
		console.log("Requête reçue pour le chemin.");
		handle["/upload"](res, req);
	});
	
	
	app.use("/styles", express.static(__dirname + '/public/styles'));
	
	console.log("Démarrage du serveur.");
}

// exportation de la fonction de lancement du serveur
exports.start = start;