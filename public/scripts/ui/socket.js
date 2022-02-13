import { displayMessage, displayErrorMessage } from "./main.js";
import { dateTimestamp } from "./dateTimeUtils.js";
import { getState as getUserState } from "./userState.js";
import { getState as getChatState } from "./chatState.js";

let websocket = null;
let remoteSocketUrl = "ws://mio-chat-server.herokuapp.com/index.js";
//websocket readyState constants
let CONNECTING = 0;
let OPEN = 1;
let CLOSING = 2;
let CLOSED = 3;
//end websocket readyState constants

export function createSocket() {
    let socket = new WebSocket(remoteSocketUrl);
    initializeSocketEventHandlers(socket);
    return socket;
}

export function setSocket(socket) {
    websocket = socket;
}

/*
 * Sends message to websocket.
 * Returns true if the message was successfully sent, else false.
 */
export function sendMessage(message) {
    if (websocket != null && websocket.readyState === OPEN) {
        websocket.send(JSON.stringify(message));
        return true;
    }
    return false;
}

function onOpen() {
    const { userId, username } = getUserState();
    const { chatId, chatName } = getChatState();
    let userInfo = {
        action: "JoinChannel",
        clientId : userId,
        username: username,
        channelId: chatId,
        channelName: chatName
    };
    websocket.send(JSON.stringify(userInfo));
}

function onMessage(event) {
    let data = JSON.parse(event.data);
    const { username } = getUserState();
    let senderId = data["username"];
    if (senderId === username) {
        displayMessage(data["message"], "self", dateTimestamp(), data["messageId"], data["username"]);
    }
    else {
        displayMessage(data["message"], "other", dateTimestamp(), data["messageId"], data["username"]);
    }
}

function initializeSocketEventHandlers(socket) {
    socket.onerror = (event) => displayErrorMessage("An error occurred when attempting to connect to the chat server.\nTry reloading the page.");
    socket.onopen = onOpen;
    socket.onmessage = onMessage;
}

function attemptSocketConnection() {
    clearTimeout(attemptSocketConnection);
    websocket = createSocket();
}

/*
 * Handles a failure to send a message.
 * A message may fail to send because the websocket is undefined, or its readyState is not open.
 * This function's responsibility is to let the user know why their message failed to send, and
 * attempt to establish a new socket connection if needed.
 */
function handleSendMessageFailure() {
    if (websocket == null || websocket.readyState === CLOSED || websocket.readyState === CLOSING) {
        displayErrorMessage("An error occurred when sending your message to the chat server.\nAttempting to reconnect.");
        setTimeout(attemptSocketConnection, 3000);
    }
    else if (websocket.readyState === CONNECTING) {
        displayErrorMessage("Currently Connecting to the server.");
    }
}

function sendFriendRequestNotification(fromUsername, toUsername) {
    let message = {
        action: "notifyFriendRequest",
        username: fromUsername,
        toUsername: toUsername
    };
    sendMessage(message);
}