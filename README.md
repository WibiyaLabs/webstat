webstat
=======
node.js web server usage statistics



usage
-----
The usage is very simple

```javascript
var server = require('./webstat');

server.startServer(function(req, res){
   res.end('Hello world');
});
```


command line utility
--------------------
The module comes with a command utility which shows the server stats.
Usage: webstatctl status

This utility is a simple http client which calls the web server with the OPTIONS http method.

The OPTIONS http method call is only allowed from the local machine.


author
------
Itzik Paz <spideron@gmail.com>