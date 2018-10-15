window.onload = function () {
    const width = document.getElementById('size-w').value;
    const height = document.getElementById('size-h').value;
    if(localStorage.getItem('quit-game')) {
        document.getElementsByClassName("welcome")[0].style.display = "none";
        localStorage.removeItem('quit-game');
    }
    else if(localStorage.getItem('start-game')) {
        document.getElementsByClassName("welcome")[0].style.display = "none";
        document.getElementsByClassName("configuration")[0].style.display = "none";
        localStorage.removeItem('start-game');
        const width = localStorage.getItem('width');
        const height = localStorage.getItem('height');
        document.getElementById('size-w').value = width;
        document.getElementById('size-h').value = height;
        const board = new Board(width, height, 'board');
        if (document.getElementById('first-player').checked) {
            board.first_player = document.getElementById('first-player').value;
            board.second_player = document.getElementById('second-player').value;
        } else {
            board.first_player = document.getElementById('second-player').value;
            board.second_player = document.getElementById('first-player').value;
        }
        board.current_player = board.first_player;
        document.getElementsByClassName("board")[0].style.opacity = "1";
        board.event_listener();
    }
    else {
        new Board(width, height, 'board');
        document.getElementsByClassName("configuration")[0].style.display = "none";
        document.getElementsByClassName("board")[0].style.display = "none";
        document.getElementsByClassName("logout")[0].style.display = "none";
        document.getElementsByClassName("val-html")[0].style.display = "none";
        document.getElementsByClassName("val-css")[0].style.display = "none";
    }
};

function login() {
    const username = document.getElementById('user').value;
    document.getElementsByClassName("welcome")[0].style.display = "none";
    document.getElementsByClassName("board")[0].style.display = "inline-block";
    show_config();
    document.getElementsByClassName("user-logout")[0].innerHTML = username;
    document.getElementsByClassName("logout")[0].style.display = "unset";
    document.getElementsByClassName("val-html")[0].style.display = "unset";
    document.getElementsByClassName("val-css")[0].style.display = "unset";
}

function select_opponent(id) {
    if (id == "ai") {
        document.getElementById("f-label").innerText = "Player";
        document.getElementById("s-label").innerText = "AI";
        document.getElementsByClassName("config-dif")[0].style.display = "unset";
        document.getElementsByClassName("button")[0].style.margin = "10px 0 0";
    } else {
        document.getElementById("f-label").innerText = "Player 1";
        document.getElementById("s-label").innerText = "Player 2";
        document.getElementsByClassName("config-dif")[0].style.display = "none";
        document.getElementsByClassName("button")[0].style.margin = "50px 0 0";
    }
}

function start_game() {
    const width = document.getElementById('size-w').value;
    const height = document.getElementById('size-h').value;
    localStorage.setItem('start-game', 'true');
    localStorage.setItem('width', width);
    localStorage.setItem('height', height);
    window.location.reload();
}

function show_config() {
    const display = document.getElementsByClassName("configuration")[0].style.display;
    if (display == "unset") {
        document.getElementsByClassName("configuration")[0].style.display = "none";
    } else {
        document.getElementsByClassName("configuration")[0].style.display = "unset";
    }

}

function show_rules() {
    const display = document.getElementsByClassName("rules")[0].style.display;
    if (display == "unset") {
        document.getElementsByClassName("rules")[0].style.display = "none";
    } else {
        document.getElementsByClassName("rules")[0].style.display = "unset";
    }
}

function show_leaderboard() {
    const display = document.getElementsByClassName("leaderboard")[0].style.display;
    if (display == "unset") {
        document.getElementsByClassName("leaderboard")[0].style.display = "none";
    } else {
        document.getElementsByClassName("leaderboard")[0].style.display = "unset";
    }
}

function quit_game() {
    alert("Are you sure?");
    localStorage.setItem('quit-game', 'true');
    window.location.reload();
}