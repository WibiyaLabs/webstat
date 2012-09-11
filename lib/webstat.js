/**
 * The module object
 * @type {Object}
 */
var webstat = {
    /**
     * Times in milliseconds
     */
    times:{
        '1m':60 * 1000,
        '5m':60 * 5 * 1000,
        '15m':60 * 15 * 1000,
        '1h':60 * 60 * 1000,
        '1d':60 * 60 * 24 * 1000
    },
    /**
     * holds current time
     */
    currentTime:null,
    /**
     * http module
     */
    http:require('http'),
    /**
     * http server object
     */
    server:null,
    /**
     * http server options
     */
    options: {
        hostname: null,
        backlog: null,
        callback: null,
        path: null,
        handle: null
    },
    /**
     * Stats collected info
     */
    httpStatsInfo:{
        startDate:new Date(),
        requestsTotal:0,
        requestCurrent:0,
        requestsLastMinute:0,
        requestsLast5Minutes:0,
        requestsLast15Minutes:0,
        requestsLastHour:0,
        requestsLastDay:0
    },
    /**
     * Stats collecting interval handler
     */
    httpStatsIntervalHandler:null,
    /**
     * Holds stats raw data
     */
    httpStatsBucket:{}
};

/**
 * Reset the web server stats
 */
webstat.resetStats = function () {
    webstat.httpStatsInfo.requestsLastMinute =
        webstat.httpStatsInfo.requestsLast5Minutes =
            webstat.httpStatsInfo.requestsLast15Minutes =
                webstat.httpStatsInfo.requestsLastHour =
                    webstat.httpStatsInfo.requestsLastDay = 0;
};

/**
 * Update the web server stats using the raw data
 */
webstat.updateStats = function () {
    webstat.currentTime = new Date().getTime();
    webstat.resetStats();

    for (var ts in webstat.httpStatsBucket) {
        if (webstat.httpStatsBucket.hasOwnProperty(ts)) {
            if (webstat.currentTime - ts > webstat.times['1d']) {
                delete webstat.httpStatsBucket[ts];
                continue;
            }
            webstat.httpStatsInfo.requestsLastDay++;

            if (webstat.currentTime - ts <= webstat.times['1h']) {
                webstat.httpStatsInfo.requestsLastHour++;
            }

            if (webstat.currentTime - ts <= webstat.times['15m']) {
                webstat.httpStatsInfo.requestsLast15Minutes++;
            }

            if (webstat.currentTime - ts <= webstat.times['5m']) {
                webstat.httpStatsInfo.requestsLast5Minutes++;
            }

            if (webstat.currentTime - ts <= webstat.times['1m']) {
                webstat.httpStatsInfo.requestsLastMinute++;
            }
        }
    }
};

/**
 * Start collecting stats
 */
webstat.startStats = function () {
    webstat.httpStatsIntervalHandler = setInterval(function () {
        webstat.updateStats();
    }, 1000);
};

/**
 * Stop collecting stats and reset the data
 */
webstat.stopStats = function () {
    clearInterval(webstat.httpStatsIntervalHandler);
    webstat.resetStats();
    webstat.httpStatsBucket = {};
};

/**
 * request handler, fired on every new request made to the server
 * @param req   http.ServerRequest object
 * @param res   http.ServerResponse object
 * @param requestHandler    User defined request handler, will be fired with the req,res vars - requestHandler(req, res)
 */
webstat.onRequest = function (req, res, requestHandler) {
    webstat.httpStatsInfo.requestsTotal++;
    webstat.httpStatsInfo.requestCurrent++;
    webstat.currentTime = new Date().getTime();
    webstat.httpStatsBucket[webstat.currentTime] = webstat.httpStatsBucket[webstat.currentTime] || 0;
    webstat.httpStatsBucket[webstat.currentTime]++;
    req.connection.on('end', webstat.onRequestEnd).on('close', webstat.onRequestEnd);

    if (req.method == 'OPTIONS') {
        res.end(req.connection.remoteAddress != '127.0.0.1' ?
            'OPTIONS not allowed from this location!' :
            JSON.stringify(webstat.httpStatsInfo)
        );
        return;
    }

    requestHandler(req, res);
};

/**
 * Handles stats when the request ends
 */
webstat.onRequestEnd = function () {
    if (webstat.httpStatsInfo.requestCurrent > 0) {
        webstat.httpStatsInfo.requestCurrent--;
    }
};

/**
 * Start the web server and the stats collecting
 * @param requestHandler    User defined request handler, will be fired with the req,res vars - requestHandler(req, res)
 */
webstat.startServer = function (requestHandler) {
    if(arguments.length > 1){
        for(var o in arguments[1]){
           if(arguments[1].hasOwnProperty(o)){
               webstat.options[o] = arguments[1][o];
           }
        }
    }
    webstat.startStats();
    webstat.server = webstat.http.createServer(function (req, res) {
        webstat.onRequest(req, res, requestHandler);
    });

    if(webstat.options.path !== null){ // use unix socket
        if(webstat.options.callback !== null){
            webstat.server.listen(webstat.options.path, webstat.options.callback);
        }
        else{
            webstat.server.listen(webstat.options.path);
        }
    }
    else if(webstat.options.handle !== null){ // use existing unix file descriptor / handle
        if(webstat.options.callback !== null){
            webstat.server.listen(webstat.options.handle, webstat.options.callback);
        }
        else{
            webstat.server.listen(webstat.options.handle);
        }
    }
    else{ // listen on tcp port
        webstat.options.port = webstat.options.port || 80;
        if(webstat.options.hostname !== null){
            if(webstat.options.backlog !== null){
                if(webstat.options.callback !== null){
                    webstat.server.listen(webstat.options.port, webstat.options.hostname, webstat.options.backlog, webstat.options.callback);
                }
                else{
                    webstat.server.listen(webstat.options.port, webstat.options.hostname, webstat.options.backlog);
                }
            }
            else{
                webstat.server.listen(webstat.options.port, webstat.options.hostname);
            }
        }
        else{
            webstat.server.listen(webstat.options.port);
        }
    }
};

/**
 * Stop the web server and the stats collecting
 */
webstat.stopServer = function () {
    webstat.stopStats();
    webstat.server.close();
    webstat.server = null;
};

module.exports = webstat;