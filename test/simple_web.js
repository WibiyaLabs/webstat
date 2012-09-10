var server = require('./webstat');

server.startServer(function(req, res){
   res.end('Hello world');
});
