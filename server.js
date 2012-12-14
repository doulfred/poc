var express = require('express');
var app = express.createServer(express.logger());
var port = process.env.PORT || 5000;

// Module de lancement : pour une conception evenementielle
function start() {
	app.get('/', function (req, res) {
		console.log("Requête reçue pour le chemin." + __dirname);
		res.sendfile(__dirname + '/public/index.html');
	});

	app.use("/public", express.static(__dirname + '/public'));


	app.listen(port, function() {
	  console.log("Listening on " + port);
	});
}


// exportation de la fonction de lancement du serveur
exports.start = start;
//start();