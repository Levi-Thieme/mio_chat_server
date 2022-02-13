import { createSocket, setSocket, sendMessage } from "./socket.js";

/*
Sends the user's message to main.php through AJAX
*/
function saveMessage() {
    let message = $("#message").val();
    if (message.trim() === "") {
        return;
    }
    let roomName = $("#roomName").val();
    if (roomName !== "") {
        $.ajax({
            type: "POST",
            async: true,
            url: "../message/storeMessage.php",
            dataType: "JSON",
            data: {
                message: "" + message + "", 
                currentRoom: "" + roomName + "", 
            },
            failure: function(data) { console.log("Failed to send message: " + message); }
        });
        $("#message").val("");
    }
}

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
    $("#roomName").val("");
    $("#roomId").val("");
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
    function sendMessageWithUserInfo() {
        let message = $("#message").val().trim();
        if (message === "") {
            return;
        }
        let clientId = $("#userId").val();
        let roomId = $("#roomId").val();
        let username = $("#username").val();
        let roomName = $("#roomName").val();
        if (clientId == "" || username == "" || roomId == "" || roomName == "") {
            displayErrorMessage("User id, username, or roomName is not set. Unable to send your message.");
            return;
        }
        let userInfo = {
            action: "message",
            clientId: clientId,
            username: username,
            channelId: roomId,
            channelName: roomName,
            message: message
        };
        if (sendMessage(userInfo)) {
            $("#message").val("");
        } else {
            handleSendMessageFailure();
        }
    }
    $("#sendMessageButton").on("click", sendMessageWithUserInfo);
    //Add enter button listener for message input
    $("#message").on("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            sendMessageWithUserInfo();
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