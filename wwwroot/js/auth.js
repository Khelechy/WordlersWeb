var baseUrl = "https://localhost:7030/";

document.getElementById("loginButton").addEventListener("click", function (event) {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    fetch(`${baseUrl}api/auth/login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": username, "password": password })
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
            console.log(data.data.user)

            localStorage.setItem('userId', data.data.user.id)
            localStorage.setItem('userName', data.data.user.userName)

            window.location.href = '/Home/Index/';
        })
        .catch(error => {

        })

    event.preventDefault();
});
