// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

var baseUrl = "https://localhost:7030/";

var userId = localStorage.getItem('userId')
var userName = localStorage.getItem('userName')

if (userId === null || userName === null) {
    console.log("Not Authenticated")
    window.location.href = '/Auth/Login/';
}

document.getElementById("createRoomButton").addEventListener("click", function (event) {
    var noOfRound = document.getElementById("roomRounds").value;
    var ownerId = userId;
    fetch(`${baseUrl}api/rooms/custom`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "ownerId": ownerId, "numberOfRounds": noOfRound })
    })
        .then(response => response.json())
        .then(data => {
            var roomCode = data.data.roomCode
            document.getElementById("roomCode").value = roomCode
        })

    event.preventDefault();
});


document.getElementById("joinRoomButton").addEventListener("click", function (event) {
    var roomCode = document.getElementById("roomCode").value;
    fetch(`${baseUrl}api/rooms/custom/${roomCode}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            var roomId = data.data.id
            var gameId = data.data.gameId
            var gameOwnerId = data.data.ownerUserId

            localStorage.setItem('roomId', roomId)
            localStorage.setItem('gameId', gameId)
            localStorage.setItem('gameOwnerId', gameOwnerId)

           window.location.href = '/Home/Room/';
        })

    event.preventDefault();
});

