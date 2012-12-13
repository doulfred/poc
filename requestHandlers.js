var fs = require("fs"),
    formidable = require("formidable");

var path = require("path");
var url = require("url");	
//var exec = require("child_process").exec;

function start(response) {
	console.log("Le gestionnaire 'start' est appelé.");
	/*
	var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" '+
	'content="text/html; charset=UTF-8" />'+
	"<link rel='stylesheet' href='styles/style.css' type='text/css' media='screen' />"+
	'</head>'+
	'<body>'+
	'<form action="/upload" enctype="multipart/form-data" '+
	'method="post">'+
	'<input type="file" name="upload" multiple="multiple">'+
	'<input type="submit" value="Transférer le fichier" />'+
	'</form>'+
	'<img src="http://localhost:8888/tmp/test.png" />'+
	'</body>'+
	'</html>';

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();*/
	
	/*
	fs.readFile(__dirname +'/public/index.html', function(error, content){
		if(error){
			console.log(error);
			response.writeHead(500, {'Content-Type' : 'text/plain'});
			response.end('Internal Server Error');
		}else{
			response.writeHead(200, {'Content-Type' : 'text/html'});
			response.end(content, 'utf-8');
		}
	});
	*/
	
	response.sendfile(__dirname + '/public/index.html');
	
}

function style(response) {
	console.log("Le gestionnaire 'style' est appelé.");
	fs.readFile(__dirname + '/public/styles/style.css', function(error, content){
		if(error){
			console.log(error);
			response.writeHead(500, {'Content-Type' : 'text/plain'});
			response.end('Internal Server Error');
		}else{
			response.writeHead(200, {'Content-Type' : 'text/css'});
			response.end(content, 'utf-8');
		}
	});
}




function upload(response, request) {
	console.log("Le gestionnaire 'upload' est appelé.");

	var form = new formidable.IncomingForm();
	console.log("Récupération des éléments reçus ");
	form.parse(request, function(error, fields, files) {
		console.log("Traitement terminé");

		/* En cas d'erreur sous Windows :
		   tentative d'écrasement d'un fichier existant */
		fs.rename(files.upload.path, __dirname + "/tmp/test.png", function(err) {
		  if (err) {
			fs.unlink(__dirname + "/tmp/test.png");
			fs.rename(files.upload.path, __dirname + "/tmp/test.png");
		  }
		});
		/*
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("Image reçue :<br/>");
		response.write("<img src='/show' />");
		response.end();
		*/
		
		response.sendfile(__dirname + '/public/index.html');
	});
}





function show(response, request) {
	console.log("Le gestionnaire 'show' est appelé.");
	
	var uri = url.parse(request.url).pathname;
	//var filename = path.join("/tmp", uri);
	
	var filename = __dirname + "/tmp";
	fs.readdir(filename, function(err1, files){
		if(err1){ 
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write("Error when reading directory: " + err1 + "\n");
			console.log("HTTP: " + filename + " Could Not Be Read. 500 returned to " + request.connection.remoteAddress);
			response.end();
			console.log("HTTP: Disconnected: " + request.connection.remoteAddress);
			return;
		} else {
			response.writeHead(200);
			response.write("<HTML><HEAD><title>Directory Listing for " + uri + "</title></HEAD><BODY><h1>Directory Listing for " + uri + "</h1>");
			response.write("<ul>");
			/*
			function printBr(element, index, array) {
				response.write("<li>" + element + "</li>");
			}
			files.forEach(printBr);
			*/
			
			for( i in files ){
				response.write("<li>" + files[i] + "</li>");
				
				fs.readFile(/*filename+"/"+files[i]*/"/tmp/test.png", "binary", function(error, file) {
					//console.log(file);
					if(error) {
						//response.writeHead(500, {"Content-Type": "text/plain"});
						response.write(error + "\n");
						//response.end();
					} else {
						//response.writeHead(200, {"Content-Type": "image/png"});
						response.write(file, "binary");
						//response.write("<img src='/show/"+file+"' />");
						//response.end();
					}
				});
			}
			response.write("</ul>");
			response.write("</BODY></HTML>");
			console.log("HTTP: Directory listing for " + filename + " sent to " + request.connection.remoteAddress);
			response.end();
			console.log("HTTP: Disconnected: " + request.connection.remoteAddress);
			
			return;
		}
	});

}

exports.start = start;
exports.style = style;
exports.upload = upload;
exports.show = show;