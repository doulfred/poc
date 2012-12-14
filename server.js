var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function (req, res) {
	console.log("Requête reçue pour le chemin." + __dirname);
	res.sendfile(__dirname + '/public/index.html');
});

app.use("/public", express.static(__dirname + '/public'));


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});