import { Server, WebSocket } from "ws";
import { Server as httpServer } from "http";

interface Message {
    action: string,
    clientId: string,
    username: string,
    channelId: string,
    channelName: string,
    message: string,
    ws: WebSocket
};

export default class MessageServer {

    private channels = new Map<string, WebSocket[]>();
    private wss: Server;
    
    constructor(server: httpServer) {
        this.wss = new Server({ server: server, clientTracking: true });
    }

    public listen(): void {
        this.wss.on('connection', (ws, req) => {
            ws.on("error", (error) => console.error(error.message));
            ws.on("message", (data) => this.onMessage(ws, JSON.parse(data.toString())));
        });
        
        this.wss.on("error", (error) => console.error(error.message));
        this.wss.on("close", () => console.log("Websocket Server closed."));
    }

    public stop(): void {
        this.wss.close();
    }

    /*
    Adds a client to the specified channel.
    If the channel is not contained in the this.channels map, then a new channel is created.
    */
    private addClientToChannel(channelId: string, clientSocket: WebSocket) {
        if (this.channels.has(channelId)) {
            const sockets: WebSocket[] = this.channels.get(channelId) as WebSocket[];
            if (sockets.includes(clientSocket)) {
            return false;
            }
            else {
            sockets.push(clientSocket);
            }
        }
        else {
            this.channels.set(channelId, [clientSocket]);
        }
        return true;
    }


    /*
    Removes a client from the specified channel.
    */
    private removeClientFromChannel(channelId: string, clientSocket: WebSocket) {
        const channel = this.channels.get(channelId) as WebSocket[];
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
    private broadcastToChannel(channelId: string, message: string, username: string) {
        const channel = this.channels.get(channelId) as WebSocket[];
        if (channel) {
            channel.forEach(client => {
            client.send(JSON.stringify({ message: message, username: username, messageId: Date.now()}))
            });
        }
    }

    private onMessage(clientSocket: WebSocket, message: Message) {
        if (message.action === "message") {
            this.broadcastToChannel(message.channelId, message.message, message.username);
        }
        else if (message.action === "JoinChannel") {
            this.addClientToChannel(message.channelId, clientSocket);
            this.broadcastToChannel(message.channelId, `${message.username} has joined!`, message.username);
        }
        else if (message.action === "LeaveChannel") {
            this.removeClientFromChannel(message.channelId, clientSocket);
            this.broadcastToChannel(message.channelId, `${message.username} has left the channel.`, message.username);
        }
    }
}