var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var _nickname = '';
var _color = '';


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
	_color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
 
	socket.on('set nickname', function(nickname) {
		// Save a variable 'nickname'
		socket.set('nickname', nickname, function() {
			if (_nickname == ''){
				console.log('Connect', nickname);
				var connected_msg = '<b style="float:right;color:'+_color+'">"' + nickname + '" est connectÃ©.</b>';
			}
			else{
				console.log('Change nickname', nickname);
				var connected_msg = '<b style="float:right;color:'+_color+'">"' + _nickname + '" a changé son surnom pour "'+ nickname +'".</b>';
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
			server.io.sockets.volatile.emit( 'broadcast_msg' , '<font style="color:'+_color+'">'+nickname + ': ' + msg +'</font>' );
		});
	});
	
	
	// Handle disconnection of clients
	socket.on('disconnect', function () {
		socket.get('nickname', function (err, nickname) {
		  console.log('Disconnect', nickname);
		  var disconnected_msg = '<b style="float:right;color:'+_color+'">"' + nickname + '" est partie.</b>'

		  // Broadcast to all users the disconnection message
		  server.io.sockets.volatile.emit( 'broadcast_msg' , disconnected_msg);
		});
	});
});
	