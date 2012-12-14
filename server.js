//var http = require("http");
var express = require("express"), 
	app = express.createServer(),
	url = require("url");


// Module de lancement : pour une conception evenementielle
function start() {
	
	//http.createServer(onRequest).listen(8888);
	app.listen(process.env.C9_PORT || 5000);
	
	
	app.get('/', function (req, res) {
		console.log("Requête reçue pour le chemin." + __dirname);
		res.sendfile(__dirname + '/public/index.html');
	});
	
	
	app.use("/public", express.static(__dirname + '/public'));
	
	console.log("Démarrage du serveur.");
}

// exportation de la fonction de lancement du serveur
//--exports.start = start;

start();