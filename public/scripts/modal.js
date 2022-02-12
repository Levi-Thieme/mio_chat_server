
//opens the slider and configures it for creating a chat room.
function openCreateRoomModal() {
    $("#optionList").empty();
    document.getElementById("modalTitle").innerHTML = "Chat Name";
    document.getElementById("modalSubmitBtn").innerHTML = "Create";
    $("#modalInput").off("keyup");
    $("#modalSubmitBtn").off("click");
    $("#modalSubmitBtn").on("click", (event) => {
        const newChatName = $("#modalInput").val().trim();
        if (newChatName === "") {
            return;
        }
        $.ajax({
            url: controllersPath + "roomHandler.php",
            type: "GET",
            async: true,
            data: {
                request: "createRoom",
                roomName: newChatName
            },
            success: function(roomId) { 
                $("#modalInput").val("");
                $("#myModal").hide();
                let roomElement = createRoomDiv(roomId, newChatName);
                $("#roomList").append(roomElement);
                displayToast("New Room", "Created New Room: " + newChatName);
            },
            failure: function(data) { alert(data["reason"]); }
        });
    });
    $("#myModal").modal();
}

//opens the slider and configures it for inviting someone to a chat.
function openInviteToChatModal(chatName) {
    $("#optionList").empty();
    document.getElementById("modalTitle").innerHTML = "Invite A Friend to " + chatName;
    document.getElementById("modalSubmitBtn").innerHTML = "Invite";
    let searchTimeout;
    $("#modalInput").on("keyup", function(event) {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        searchTimeout = setTimeout((event) => searchFriends($("#modalInput").val()), 150);
    });
    $("#modalSubmitBtn").off("click");
    $("#modalSubmitBtn").on("click", (event) => {
        let selectedNames = Array.from(document.getElementById("optionList").getElementsByClassName("list-group-item active"))
            .map(element => element.innerText);
        selectedNames.forEach(selectedName => {
            let name = selectedName;
            $.ajax({
                url: controllersPath + "roomHandler.php",
                type: "GET",
                async: true,
                data: {
                    request: "addToRoom",
                    userToAdd: name,
                    roomName: chatName
                },
                complete: function (data) { 
                    $("#modalInput").val("");
                    $("#myModal").hide();
                    displayToast("Room Invite", "Invited " + selectedNames.join(", ") + " to " + chatName);
                },
                failure: function (data) { alert("Failed to invite " + name + " to " + $("#currentRoom")); }
            });
        });
    });
    $("#myModal").modal();
}

//opens the slider and configures for sending a friend request.
function openFriendRequestModal() {
    $("#optionList").empty();
    document.getElementById("modalTitle").innerHTML = "Send A Friend Request";
    document.getElementById("modalSubmitBtn").innerHTML = "Send";
    let searchTimeout;
    $("#modalInput").on("keyup", function(event) {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        searchTimeout = setTimeout((event) => searchFriends($("#modalInput").val()), 150);
    });
    $("#modalSubmitBtn").off("click");
    $("#modalSubmitBtn").on("click", (event) => {
        let selectedNames = Array.from(document.getElementById("optionList").getElementsByClassName("list-group-item active"))
            .map(selectedListItem => selectedListItem.innerText);
        $.ajax({
            url: controllersPath + "friendHandler.php",
            type: "GET",
            async: true,
            data: {
                request: "sendFriendRequest",
                receivers: JSON.stringify(selectedNames)
            },
            dataType: "JSON",
            complete: function (data) {
                $("#modalInput").val("");
                $("#myModal").hide();
                let addedRequests = data.responseJSON;
                addedRequests.forEach(name => {
                    let element = createFriendRequestToDiv(name);
                    $("#friendsCollapse").append(element);
                });
                displayToast("Friend Request", "Sent a friend request to " + selectedNames.join(", "));
            },
            failure: function () { alert("Failed to send friend request(s). Please try again later."); }
        });
    });
    $("#myModal").modal();
}

$(document).ready(function() {
    $("#optionList").click(function(event) {
        if (event && event.target && event.target.tagName === "LI") {
            if (event.target.classList.contains("active")) {
                event.target.classList.remove("active");
            }
            else {
                event.target.classList.add("active");
            }
        }
    });
});

function searchFriends(name) {
    $.ajax({
        url: controllersPath + "friendHandler.php",
        type: "GET",
        async: true,
        data: {
            request: "searchFriend",
            friendName: name
        },
        datatype: "HTML",
        success: function(data) { 
            $("#optionList").html(data);
         },
        failure: function(data) { console.log("Failed to search for friend: " + $("#addName").val()); }
    });
}