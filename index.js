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

const http = require('http')

const hostname = 'localhost'

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})