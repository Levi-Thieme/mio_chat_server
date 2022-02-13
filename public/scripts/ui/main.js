import { createSocket, setSocket, sendMessage as sendSocketMessage } from "./socket.js";
import { setState as setChatState, getState as getChatState } from "./chatState.js";
import { getState as getUserState } from "./userState.js";
import { timestamp } from "./dateTimeUtils.js";

/*
Appends a message div into the chat
*/
export function displayMessage(message, classStyle, time, id, name) {
    if (message !== "")  {
        let messageItem =
        '<li id ="'+id+'" class="'+classStyle+'">'+
            '<div class="avatar animated pulse"><img src="user.png" alt="User profile picture"/></div>'+
            '<div class="messages div-dark animated pulse"><p class="username">'+name+'</p><p>'+message+'</p><time>'+time+'</time></div>'+
        '</li>';
        
        $("#messageList").append(messageItem);
        $("#messageContainer").scrollTop($("#messageContainer").prop("scrollHeight"));
    }
}


/*
Clears the inputs for room name and id
*/
export function clearRoom() {
    setChatState({ chatId: "", chatName: "" });
}

/*
Clears the chat's messages
*/
export function clearMessages() {
    $("#messageList").html("");
}

export function displayErrorMessage(message) {
    displayToast("Error", message);
}

$(document).ready(function() {
    const websocket = createSocket();
    setSocket(websocket);

    //Sends the username, channel, and message through websocket
    function sendMessage() {
        const { userId, username } = getUserState();
        const { chatId, chatName, message } = getChatState();
        const normalizedMessage = message.trim();
        if (normalizedMessage === "") {
            return;
        }
        if (userId == "" || username == "" || chatId == "" || chatName == "") {
            displayErrorMessage("User id, username, or roomName is not set. Unable to send your message.");
            return;
        }
        let socketMessage = {
            action: "message",
            clientId: userId,
            username: username,
            channelId: chatId,
            channelName: chatName,
            message: normalizedMessage
        };
        if (sendSocketMessage(socketMessage)) {
            setChatState({ message: "" });
            return true;
        } else {
            handleSendMessageFailure();
            return false;
        }
    }
    $("#sendMessageButton").on("click", (event) => {
        if (sendMessage()) {
            $("#message").val("");
        }
    });
    $("#message").on("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            if (sendMessage()) {
                $("#message").val("");
            }
        }
        else {
            const message = event.target.value;
            setChatState({ message: message.trim() });
        }
    });
});

function displayToast(header, body) {
    $("#notificationToastHeader").text(header);
    $("#notificationToastTime").text("  " + timestamp());
    $("#notificationToastBody").text(body);
    $(".toast").toast({
        delay: 5000
    });
    $(".toast").toast("show");
}