url = "http://twserver.alunos.dcc.fc.up.pt:8008/"
function register(nick, pass) {
    fetch(url+'register', {
        method: 'post',
        body: JSON.stringify({'nick':nick, 'pass':pass})
    })
    .then(response => response.json())
    .then(function(response) {
        if(Object.keys(response).length == 0) {
            document.getElementsByClassName("welcome")[0].style.display = "none";
            document.getElementsByClassName("board")[0].style.display = "inline-block";
            show_config();
            document.getElementsByClassName("user-logout")[0].innerHTML = nick;
            document.getElementsByClassName("logout")[0].style.display = "unset";
            document.getElementsByClassName("val-html")[0].style.display = "unset";
            document.getElementsByClassName("val-css")[0].style.display = "unset";
            document.getElementsByClassName("github")[0].style.display = "unset";
        }
        else {
            document.getElementsByClassName("login-error")[0].innerHTML = response.error;
            document.getElementsByClassName("login-error")[0].style.display = "unset";
            document.getElementById('user').style.borderColor = "red";
            document.getElementById('pass').style.borderColor = "red";
        }
    });
}

function join(group, nick, pass, size) {

}

function leave(nick, pass, size) {

}

function notify(nick, pass, game, column) {

}

function notify(nick, pass, game, column) {

}

function update(nick, game) {

}

function ranking(size) {

}