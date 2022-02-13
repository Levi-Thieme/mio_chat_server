import express, { Application, Request, Response, Router } from "express";
import { Server, WebSocket } from "ws";
import path from "path";
import accountRoutes from "./routes/account"
import homeRoutes from "./routes/home";

const PORT = process.env.PORT || 3000;

const app: Application = express()
  .use(express.static(path.join(__dirname, './public/views')))
  .use(express.static(path.join(__dirname, './public/styles')))
  .use(express.static(path.join(__dirname, './public/scripts/lib')))
  .use(express.static(path.join(__dirname, './public/scripts/ui')))
  .use(express.static(path.join(__dirname, './public/imgs')))
  .use(express.json())
  .use("/", accountRoutes)
  .use("/", homeRoutes);


const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));


const channels = new Map<string, WebSocket[]>();

const wss = new Server({ server: server, clientTracking: true });

interface Message {
  action: string,
  clientId: string,
  username: string,
  channelId: string,
  channelName: string,
  message: string,
  ws: WebSocket
};
/*
let userInfo = {
            clientId: clientId,
            username: username,
            channelId: roomId,
            channelName: roomName,
            message: message
        };
*/
wss.on('connection', (ws, req) => {
  ws.on("error", (error) => console.error(error.message));
  ws.on("message", (data) => onMessage(ws, JSON.parse(data.toString())));
});

wss.on("error", (error) => console.error(error.message));
wss.on("close", () => console.log("Websocket Server closed."));

/*
Adds a client to the specified channel.
If the channel is not contained in the channels map, then a new channel is created.
*/
function addClientToChannel(channelId: string, clientSocket: WebSocket) {
  if (channels.has(channelId)) {
    const sockets: WebSocket[] = channels.get(channelId) as WebSocket[];
    if (sockets.includes(clientSocket)) {
      return false;
    }
    else {
      sockets.push(clientSocket);
    }
  }
  else {
    channels.set(channelId, [clientSocket]);
  }
  return true;
}


/*
Removes a client from the specified channel.
*/
function removeClientFromChannel(channelId: string, clientSocket: WebSocket) {
  const channel = channels.get(channelId) as WebSocket[];
  if (channel) {
    let clientIndex = channel.findIndex(client => client == clientSocket);
    if (clientIndex > -1) {
      channel.splice(clientIndex, 1);
    }
  }
}

/*
Sends a message to every client in the channel specified by channelId.
*/
function broadcastToChannel(channelId: string, message: string, username: string) {
  const channel = channels.get(channelId) as WebSocket[];
  if (channel) {
    channel.forEach(client => {
      client.send(JSON.stringify({ message: message, username: username, messageId: Date.now()}))
    });
  }
}

function onMessage(clientSocket: WebSocket, message: Message) {
  if (message.action === "message") {
    broadcastToChannel(message.channelId, message.message, message.username);
  }
  else if (message.action === "JoinChannel") {
    addClientToChannel(message.channelId, clientSocket);
    broadcastToChannel(message.channelId, `${message.username} has joined!`, message.username);
  }
  else if (message.action === "LeaveChannel") {
    removeClientFromChannel(message.channelId, clientSocket);
    broadcastToChannel(message.channelId, `${message.username} has left the channel.`, message.username);
  }
}