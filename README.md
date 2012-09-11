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



Copyright and license
---------------------
Modular Patterns Ltd. (c) 2012 All Rights Reserved

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.