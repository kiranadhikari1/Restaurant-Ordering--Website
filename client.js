console.log("client-connected");

// event listeners for button clicks- {log out, register, and login}
var loginListen = document.getElementById("login");
if(loginListen){
	loginListen.addEventListener("click", userLogin);
}

var userListen = document.getElementById("addNewUser");
if(userListen){
	userListen.addEventListener("click", createNewUser);
}

var logoutListen = document.getElementById("logoutbutton");
if(logoutListen){
    logoutListen.addEventListener("click", logOut);
}

function userLogin(){
    let xhttp = new XMLHttpRequest();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let userInfo = {"username": username, "password": password};
    console.log("clicked");
    xhttp.onreadystatechange = function(){
        if (xhttp.readyState == 4 && xhttp.status == 401){
			alert("Unauthorized, invalid username or password");
		}
        if (xhttp.readyState == 4 && xhttp.status == 201){
            window.location.href= ("/home");
        }
    }

    xhttp.open("POST", "http://127.0.0.1:3000/login", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(userInfo));
}

function createNewUser(){
    let xhttp = new XMLHttpRequest();
    let username = document.getElementById("newUsername").value;
    let password = document.getElementById("newPassword").value;
    let newUser = {"username": username, "password": password};

    xhttp.onreadystatechange = function(){
        if (xhttp.readyState == 4 && xhttp.status == 400){
			alert("Username already taken!");
		}
        if (xhttp.readyState == 4 && xhttp.status == 201){
			console.log("response: "+this.responseText);
			let res = JSON.parse(this.responseText);
			window.location.href =("http://127.0.0.1:3000/users/"+res);
		}
    }

    xhttp.open("POST", "http://127.0.0.1:3000/register", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(newUser))
}

function logOut(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (xhttp.readyState == 4 && xhttp.status == 200){
            window.location.href= ("/home");
        }
    }
    
    xhttp.open("GET", "http://127.0.0.1:3000/logout", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}


function searchBar(){
    let xhttp = new XMLHttpRequest();
    let search = document.getElementById("").value;
    xhttp.onreadystatechange = function(){
        if (xhttp.readyState == 4 && xhttp.status == 200){
            window.location.href= ("/home");
        }
    }
    xhttp.open("GET", "http://127.0.0.1:3000/", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}