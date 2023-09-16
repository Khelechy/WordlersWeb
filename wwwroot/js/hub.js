"use strict";

var baseUrl = "https://localhost:7030/";
let connected = false;

var userId = localStorage.getItem('userId')
var userName = localStorage.getItem('userName')

if (userId === null || userName === null) {
    console.log("Not Authenticated")
    window.location.href = '/Auth/Login/';
}

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

var connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7030/gameHub").withHubProtocol(new signalR.protocols.msgpack.MessagePackHubProtocol()).build();

var roomId = localStorage.getItem('roomId')
var gameId = localStorage.getItem('gameId')
var gameOwnerId = localStorage.getItem('gameOwnerId')
var word = "";

var isInRound = false;

if (gameOwnerId === userId) {
    document.getElementById("startGameButton").disabled = false;
} else {
    document.getElementById("startGameButton").disabled = true;
}

async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
        document.getElementById("sendButton").disabled = false;

        await addToRoom()

      
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

async function addToRoom() {
    try {
        await connection.invoke("AddToRoom", roomId, userName, userId)
    } catch (err) {
        console.log(err)

    }
}

connection.onclose(async () => {
    await start();
});

// Start the connection.
start();

connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user} : ${message}`;
});

connection.on("ReceiveRoundStatus", function (status) {
    if (status === true) {
        isInRound = true;
    } else {
        isInRound = false;
    }
});

connection.on("ReceiveRoundGameWord", function (newWord) {
    word = newWord
});



document.getElementById("sendButton").addEventListener("click", function (event) {

    if (isInRound) {
        var message = document.getElementById("messageInput").value;
        var messageObject = {
            MessageBody: message,
            RoomId: roomId,
            GameId: gameId,
            OriginalWord: word,
            UserName: userName,
            UserId: userId
        }
        connection.invoke("SendUserInputRoomMessage", userName, messageObject).catch(function (err) {
            return console.error(err.toString());
        });
    } else {

        var message = document.getElementById("messageInput").value;
        var messageObject = {
            MessageBody: message,
            RoomId: roomId,
            GameId: gameId,
            OriginalWord: word,
            UserName: userName,
            UserId: userId
        }
        connection.invoke("SendRoomMessage", userName, messageObject).catch(function (err) {
            return console.error(err.toString());
        });
    }

    document.getElementById("messageInput").value = "";
    event.preventDefault();
});


document.getElementById("startGameButton").addEventListener("click", function (event) {
    fetch(`${baseUrl}api/game/start`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "gameId": gameId, "roomId": roomId })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("startGameButton").disabled = false;
        })

    event.preventDefault();
});


