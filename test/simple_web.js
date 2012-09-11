var server = require('../lib/webstat');

server.startServer(function(req, res){
   res.end('Hello world');
});
