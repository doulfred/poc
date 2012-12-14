var server = require("./server");
/*var router = require("./router");
var requestHandlers = require("./requestHandlers");

// gestionnaires de requete => liste d'action
var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
//handle["/styles/style.css"] = requestHandlers.style;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;
*/
// on mance le serveur en tranmetant le routeur + les "actions"
server.start(/*router.route, handle*/);