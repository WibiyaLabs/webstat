function requestStats() {
    var http = require('http'),
        options = {
            host:'127.0.0.1',
            method:'OPTIONS'
        },
        req = http.request(options, function (res) {
            res.on('data', function (chunk) {
                var result = JSON.parse(chunk.toString()),
                    currentTime = new Date().getTime(),
                    serverStartTime = new Date(result.startDate).getTime();

                process.stdout.write('\u001B[2J\u001B[0;0f'); // Clear terminal and move cursor to 0,0
                process.stdout.write('Server up since: ' + result.startDate + "\n" +
                    'Current requests: ' + result.requestCurrent + "\n" +
                    'Total requests: ' + result.requestsTotal + "\n" +
                    '   avg req/sec: ' + (result.requestsTotal / ((currentTime - serverStartTime) / 1000)).toFixed(2) + "\n" +
                    'Last minute requests: ' + result.requestsLastMinute + "\n" +
                    '   avg req/sec: ' + (result.requestsLastMinute / 60).toFixed(2) + "\n" +
                    'Last 5 minutes requests: ' + result.requestsLast5Minutes + "\n" +
                    '   avg req/sec: ' + (result.requestsLast5Minutes / 300).toFixed(2) + "\n" +
                    'Last 15 minutes requests: ' + result.requestsLast15Minutes + "\n" +
                    '   avg req/sec: ' + (result.requestsLast15Minutes / 900).toFixed(2) + "\n" +
                    'Last hour requests: ' + result.requestsLastHour + "\n" +
                    '   avg req/sec: ' + (result.requestsLastHour / 3600).toFixed(2) + "\n" +
                    'Last 24 hours requests: ' + result.requestsLastDay + "\n" +
                    '   avg req/sec: ' + (result.requestsLastDay / 86400).toFixed(2) + "\n");
            });
        });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}

var help = [
    "webstat command line utility",
    "usage: webstatctl [command]",
    "",
    "command:",
    "  status     Show the web server stats",
    "  help       Show this help",
    ""
].join("\n");

if (process.argv.length !== 3) {
    console.log("Invalid arguments\n");
    console.log(help);
    process.exit(1);
}

switch (process.argv[2]) {
    case 'status':
        setInterval(requestStats, 2000);
        break;
    case 'help':
        console.log(help);
        process.exit(0);
        break;
    default:
        console.log("Invalid command: " + process.argv[2] + "\n");
        console.log(help);
        process.exit(1);
        break;
}