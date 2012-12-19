var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var _nickname = '';
var _color = '';
var _allClients = 0;
var _clientId = 1;

// gestionnaires de requete => liste d'action
var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;

// on lance le serveur en tranmetant le routeur + les "actions"
server.start(router.route, handle);

	
// creating a new websocket to keep the content updated without any AJAX request
server.io.sockets.on('connection', function(socket) {
	var my_timer;
	_color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
	var my_client = {
        "id": _clientId,
        "obj": socket,
		"isNew": true,
		"color":_color 
    };
	
    _clientId += 1;
    _allClients += 1;
	
	// affiche les status du tchat
	my_timer = setInterval(function () {
		console.log('setInterval status', _allClients);
        /*my_client.obj.send(JSON.stringify({
            "timestamp": (new Date()).getTime(),
            "clients": _allClients,
			"clientId": my_client.id
        }));*/
		server.io.sockets.volatile.emit('status_msg', _allClients);
    }, 1000);
	
	
	socket.on('set nickname', function(nickname) {
		// Save a variable 'nickname'
		socket.set('nickname', nickname, function() {
			if (my_client.isNew == true ){
				console.log('Connect', nickname);
				var connected_msg = '<b style="float:right;color:'+_color+'">"' + nickname + '" est connecté.</b>';
			}
			else{
				console.log('Change nickname', nickname);
				var connected_msg = '<b style="float:right;color:'+_color+'">"' + _nickname + '" a changé son surnom pour "'+ nickname +'".</b>';
				my_client.isNew == false;
			}
			_nickname = nickname;
			// send message
			server.io.sockets.volatile.emit('broadcast_msg', connected_msg);
		});
	});
	
	
	socket.on('emit_msg', function (msg) {
		// Get the variable 'nickname'
		socket.get('nickname', function (err, nickname) {
			console.log('Chat message by', nickname);
			server.io.sockets.volatile.emit( 'broadcast_msg' , '<font style="float:left;color:'+_color+'">'+nickname + ': ' + msg +'</font>' );
		});
	});
	
	
	// Handle disconnection of clients
	socket.on('disconnect', function () {
		clearTimeout(my_timer);
        _allClients -= 1;
		
		socket.get('nickname', function (err, nickname) {
		  console.log('Disconnect', nickname);
		  var disconnected_msg = '<b style="float:right;color:'+_color+'">"' + nickname + '" est partie.</b>'

		  // Broadcast to all users the disconnection message
		  server.io.sockets.volatile.emit( 'broadcast_msg' , disconnected_msg);
		});
	});
});
	