const express = require("express");
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.send("hello"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const channels = new Map();

const { Server } = require('ws');
const wss = new Server({ server: server, clientTracking: true });
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
  ws.on("error", (error) => console.error(error));
  ws.on("message", (data) => onMessage(ws, data));
});

wss.on("error", (error) => console.error(error));
wss.on("close", () => console.log("Websocket Server closed."));

/*
Adds a client to the specified channel.
If the channel is not contained in the channels map, then a new channel is created.
*/
function addClientToChannel(channelId, data) {
  if (channels.has(channelId) && channels.get(channelId).findIndex(ws => ws === data.ws) != -1) {
    return false;
  }
  if (channels.has(channelId)) {
    channels.get(channelId).push(data.ws);
    
  }
  else {
    channels.set(channelId, new Array());
    channels.get(channelId).push(data.ws);
  }
  return true;
}


/*
Removes a client from the specified channel.
*/
function removeClientFromChannel(channelId, data) {
  if (channels.has(channelId)) {
    let clientIndex = channels.get(channelId).findIndex(client => client == data.ws);
    if (clientIndex > -1) {
      channels.get(channelId).splice(clientIndex, 1);
    }
  }
}

/*
Sends a message to every client in the channel specified by channelId.
*/
function broadcastToChannel(channelId, data) {
  channels.get(channelId).forEach(client => {
    client.send( JSON.stringify({ message: data.message, username: data.username, messageId: Date.now()}))
  });
}


/*
Clients send the following object as data.
let userInfo = 
  {
      clientId: clientId,
      username: username,
      channelId: roomId,
      channelName: roomName,
      message: message
  };
*/
function onMessage(ws, data) {
  data = JSON.parse(data);
  data.ws = ws;
  if (data.action === "message") {
    broadcastToChannel(data.channelId, data);
  }
  else if (data.action === "JoinChannel") {
    addClientToChannel(data.channelId, data);
    broadcastToChannel(data.channelId, { message: `${data.username} has joined!`, username: data.username});
  }
  else if (data.action === "LeaveChannel") {
    removeClientFromChannel(data.channelId, data);
    broadcastToChannel(data.channelId, { message: `${data.username} has left the channel.`, username: data.username});
  }
}