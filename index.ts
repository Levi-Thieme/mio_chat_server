import express, { Request, Response } from "express";
import { Server, WebSocket } from "ws";
const PORT = process.env.PORT || 3000;

const server = express()
  .use((req: Request, res: Response) => res.send("hello"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

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
    const sockets: WebSocket[] = channels.get(channelId);
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
  const channel = channels.get(channelId);
  if (channel) {
    let clientIndex = channel.findIndex(client => client == clientSocket);
    if (clientIndex > -1) {
      channels.get(channelId).splice(clientIndex, 1);
    }
  }
}

/*
Sends a message to every client in the channel specified by channelId.
*/
function broadcastToChannel(channelId: string, message: string, username: string) {
  channels.get(channelId).forEach(client => {
    client.send(JSON.stringify({ message: message, username: username, messageId: Date.now()}))
  });
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