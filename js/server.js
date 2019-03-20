online_first_player = ""
url = "http://twserver.alunos.dcc.fc.up.pt:8008/"
game = ""

function register(nick, pass) {
    fetch(url + 'register', {
            method: 'post',
            body: JSON.stringify({
                'nick': nick,
                'pass': pass
            })
        })
        .then(response => response.json())
        .then(function (response) {
            console.log('Rresponse: ', response);
            if (Object.keys(response).length == 0) {
                document.getElementsByClassName("welcome")[0].style.display = "none";
                document.getElementsByClassName("board")[0].style.display = "inline-block";
                show_config();
                document.getElementsByClassName("user-logout")[0].innerHTML = nick;
                document.getElementsByClassName("logout")[0].style.display = "unset";
                document.getElementsByClassName("val-html")[0].style.display = "unset";
                document.getElementsByClassName("val-css")[0].style.display = "unset";
                document.getElementsByClassName("github")[0].style.display = "unset";
            } else {
                document.getElementsByClassName("login-error")[0].innerHTML = response.error;
                document.getElementsByClassName("login-error")[0].style.display = "unset";
                document.getElementById('user').style.borderColor = "red";
                document.getElementById('pass').style.borderColor = "red";
            }
        });
}

function join(group, nick, pass, size) {
    fetch(url + 'join', {
            method: 'post',
            body: JSON.stringify({
                'group': group,
                'nick': nick,
                'pass': pass,
                'size': size
            })
        })
        .then(response => response.json())
        .then(function (response) {
            console.log('Jresponse: ', response);
            if (response.hasOwnProperty('game')) {
                game = response.game;
                update(nick);
            }
        });
}

function leave(nick, pass) {
    fetch(url + 'leave', {
            method: 'post',
            body: JSON.stringify({
                'nick': nick,
                'pass': pass,
                'game': game
            })
        })
        .then(response => response.json())
        .then(function (response) {
            console.log('Lresponse: ', response);
        });
}

function notify(nick, pass, column) {
    fetch(url + 'notify', {
            method: 'post',
            body: JSON.stringify({
                'nick': nick,
                'pass': pass,
                'game': game,
                'column': column
            })
        })
        .then(response => response.json())
        .then(function (response) {
            console.log('Nresponse: ', response);
            if (response.hasOwnProperty('error')) {
                document.getElementsByClassName("who-won")[0].innerHTML = response.error;
                document.getElementsByClassName("who-won")[0].style.width = "330px";
                document.getElementsByClassName("who-won")[0].style.display = "unset";
            }
        });
}

function update(nick) {
    const eventSource = new EventSource(url + 'update?nick=' + nick + '&game=' + game);
    eventSource.onmessage = function (event) {
        var data = JSON.parse(event.data);
        console.log('Uresponse: ', data);
        if (!data.hasOwnProperty('column') && !data.hasOwnProperty('winner')) {
            online_first_player = data.turn;
            document.getElementsByClassName("who-won")[0].style.display = "none";
            document.getElementsByClassName("board")[0].style.opacity = "1";
            set_current_player(data.turn, "red");
            board.event_listener();
        } else if (data.hasOwnProperty('turn')) {
            document.getElementsByClassName("who-won")[0].style.display = "none";
            play_online(data.column, data.turn);
        } else if (data.hasOwnProperty('winner')) {
            play_online(data.column, data.winner, true);
            who_won(board, false, true, data.winner);
            document.getElementsByClassName("current-player")[0].style.display = "none";
            eventSource.close();
        }
    }
}

function ranking(size) {
    fetch(url + 'ranking', {
            method: 'post',
            body: JSON.stringify({
                'size': size
            })
        })
        .then(response => response.json())
        .then(function (response) {
            console.log('RAresponse: ', response);
            if (response.hasOwnProperty('ranking'))
                insert_leaderboard_online(response.ranking);
        });
}
