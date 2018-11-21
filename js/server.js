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
    console.log(size);
    fetch(url+'join', {
        method: 'post',
        body: JSON.stringify({'group':group, 'nick':nick, 'pass':pass, 'size':size})
    })
    .then(response => response.json())
    .then(function(response) {
        console.log('response: ', response);
        if(response.hasOwnProperty('game')) {
            update(nick, response.game);
            notify(nick, pass, response.game, 1);
        }
    });
}

function leave(nick, pass, size) {

}

function notify(nick, pass, game, column) {
    console.log("Notify");
    fetch(url+'notify', {
        method: 'post',
        body: JSON.stringify({'nick':nick, 'pass':pass, 'game':game, 'column':column})
    })
    .then(response => response.json())
    .then(function(response) {
        console.log('response: ', response);
    });
}

function update(nick, game) {
    const eventSource = new EventSource(url + 'update?nick=' + nick + '&game=' + game);
    console.log("OK:", eventSource);
    eventSource.onmessage = function(event) {
        var data = JSON.parse(event.data);
        console.log("onmessage:", data);
    }
    //eventSource.close();
}

function ranking(size) {

}