const WebSocket = require('ws');
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: port });

wss.on('connection', function connection(ws) {
    let data = {};
    ws.on('message', function incoming(message) {
        data = JSON.parse(message);
        console.log(data);
    });
    data.message = "Hi";
    ws.send(JSON.stringify(data));
});