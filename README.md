webstat
=======
node.js web server usage statistics

Collect usage statistics:
* Total requests since the server started
* Current handled requests
* Request per second for the last minute / 5 minutes / 15 minutes / hour / day


install
-------
npm install webstat - inside your project to have the server in the node_modules
npm install -g webstat - to have the command line utility

usage
-----
The usage is very simple

```javascript
var server = require('webstat');

server.startServer(function(req, res){
   res.end('Hello world');
});
```


command line utility
--------------------
The module comes with a command utility which shows the server stats.
Usage: webstat status

This utility is a simple http client which calls the web server with the OPTIONS http method.

The OPTIONS http method call is only allowed from the local machine.


author
------
Itzik Paz <spideron@gmail.com>
