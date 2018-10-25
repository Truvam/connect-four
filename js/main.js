window.onload = function () {
    const width = get_board_size('width');
    const height = get_board_size('height');
    set_onclick_events();
    if (localStorage.getItem('quit-game')) {
        document.getElementsByClassName("welcome")[0].style.display = "none";
        localStorage.removeItem('quit-game');
        new Board(width, height, 'board');
    } else if (localStorage.getItem('start-game')) {
        insert_leaderboard('', 1)
        document.getElementsByClassName("welcome")[0].style.display = "none";
        document.getElementsByClassName("configuration")[0].style.display = "none";
        localStorage.removeItem('start-game');
        const width = localStorage.getItem('width');
        const height = localStorage.getItem('height');
        const opponent = localStorage.getItem('opponent');
        document.getElementById(opponent).checked = true;
        select_opponent(opponent);
        const first_player = localStorage.getItem('first_player');
        document.getElementById(first_player).checked = true;
        document.getElementById('size-w').value = width;
        document.getElementById('size-h').value = height;
        const board = new Board(width, height, 'board');
        if (opponent == "ai") {
            const diff = localStorage.getItem('diff');
            document.getElementById(diff).checked = true;
            if (document.getElementById('first-player').checked) {
                board.first_player = document.getElementById('first-player').value;
                board.second_player = document.getElementById('second-player').value;
                set_current_player(board.first_player, "red");
            } else {
                board.first_player = document.getElementById('first-player').value;
                board.second_player = document.getElementById('second-player').value;
                set_current_player(board.second_player, "blue");
                play_ai(board);
            }
        } else {
            if (document.getElementById('first-player').checked) {
                board.first_player = document.getElementById('first-player').value;
                board.second_player = document.getElementById('second-player').value;
                set_current_player(board.first_player, "red");
            } else {
                board.first_player = document.getElementById('second-player').value;
                board.second_player = document.getElementById('first-player').value;
                set_current_player(board.first_player, "red");
            }
        }
        board.current_player = board.first_player;
        document.getElementsByClassName("board")[0].style.opacity = "1";
        board.event_listener();
    } else {
        new Board(width, height, 'board');
        let leaderboard = {};
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        document.getElementsByClassName("configuration")[0].style.display = "none";
        document.getElementsByClassName("board")[0].style.display = "none";
        document.getElementsByClassName("logout")[0].style.display = "none";
        document.getElementsByClassName("val-html")[0].style.display = "none";
        document.getElementsByClassName("val-css")[0].style.display = "none";
        document.getElementsByClassName("github")[0].style.display = "none";
    }
};

function get_board_size(where) {
    if (where == "width") {
        const width_e = document.getElementById('size-w');
        return width_e.options[width_e.selectedIndex].value;
    } else {
        const height_e = document.getElementById('size-h');
        return height_e.options[height_e.selectedIndex].value;
    }
}

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
        document.getElementById("first-player").value = "Player";
        document.getElementById("second-player").value = "AI";
        document.getElementsByClassName("config-dif")[0].style.display = "unset";
        document.getElementsByClassName("config-btn")[0].style.margin = "20px 0 0";
    } else {
        document.getElementById("f-label").innerText = "Player 1";
        document.getElementById("s-label").innerText = "Player 2";
        document.getElementById("first-player").value = "Player 1";
        document.getElementById("second-player").value = "Player 2";
        document.getElementsByClassName("config-dif")[0].style.display = "none";
        document.getElementsByClassName("config-btn")[0].style.margin = "50px 0 0";
    }
}

function start_game() {
    const width = get_board_size('width');
    const height = get_board_size('height');
    localStorage.setItem('start-game', 'true');
    localStorage.setItem('width', width);
    localStorage.setItem('height', height);
    if (document.getElementById('ai').checked) {
        localStorage.setItem('opponent', 'ai');
        if (document.getElementById('first-player').checked) {
            localStorage.setItem('first_player', 'first-player');
        } else {
            localStorage.setItem('first_player', 'second-player');
        }
        const diff = document.querySelectorAll('input[name="config-dif"]:checked')[0].id;
        localStorage.setItem('diff', diff);
    } else {
        localStorage.setItem('opponent', 'player');
        if (document.getElementById('first-player').checked) {
            localStorage.setItem('first_player', 'first-player');
        } else {
            localStorage.setItem('first_player', 'second-player');
        }
    }
    window.location.reload();
}

function close_panels() {
    document.getElementsByClassName("configuration")[0].style.display = "none";
    document.getElementsByClassName("rules")[0].style.display = "none";
    document.getElementsByClassName("leaderboard")[0].style.display = "none";
    document.getElementsByClassName("quit")[0].style.display = "none";
}

function show_config() {
    const display = document.getElementsByClassName("configuration")[0].style.display;
    if (display == "unset") {
        close_panels();
    } else {
        close_panels();
        document.getElementsByClassName("configuration")[0].style.display = "unset";
    }

}

function show_rules() {
    const display = document.getElementsByClassName("rules")[0].style.display;
    if (display == "unset") {
        close_panels();
    } else {
        close_panels();
        document.getElementsByClassName("rules")[0].style.display = "unset";
    }
}

function show_leaderboard() {
    const display = document.getElementsByClassName("leaderboard")[0].style.display;
    if (display == "unset") {
        close_panels();
    } else {
        close_panels();
        document.getElementsByClassName("leaderboard")[0].style.display = "unset";
    }
}

function quit_game(op) {
    close_panels();
    if(op == "yes") {
        localStorage.setItem('quit-game', 'true');
        window.location.reload();
    }
    else if(op == 'show') {
        document.getElementsByClassName("quit")[0].style.display = "unset";
    }
    else {
        document.getElementsByClassName("quit")[0].style.display = "none";
    }
}

function set_current_player(current_player, color) {
    if(document.getElementsByClassName("who-won")[0].style.display == "unset") {
        document.getElementsByClassName("current-player")[0].style.display = "none";
    }
    else {
        document.getElementsByClassName("current-player")[0].style.display = "unset";
        document.getElementsByClassName("current-player")[0].innerHTML = current_player;
        if (color == "red") {
            document.getElementsByClassName("current-player")[0].style.backgroundColor = "#ff5252";
            console.log("Player 1: ", current_player);
        } else {
            document.getElementsByClassName("current-player")[0].style.backgroundColor = "#303f9f";
            console.log("Player 2: ", current_player);
        }
    }
}

function insert_leaderboard(player, start) {
    let leaderboard = localStorage.getItem('leaderboard');
    leaderboard = JSON.parse(leaderboard)
    const table = document.getElementById("table");
    const table_values = document.getElementsByClassName("table-values");
    for(let i = 0; i < table_values.length; i++) {
        table_values[i].innerHTML = "";
    }

    if(start == 0) {
        if(!leaderboard.hasOwnProperty(player)) {
            leaderboard[player] = 1
            console.log(leaderboard[player]);
        }
        else {
            leaderboard[player]++;
        }
    }    
    
    for(let key in leaderboard) {
        const tr = document.createElement('tr');
        tr.className = "table-values";
        let td = document.createElement('td');
        td.className = 'name ' + key;
        td.innerHTML = key;
        tr.appendChild(td);
        td = document.createElement('td');
        td.className = 'victory ' + key;
        td.innerHTML = leaderboard[key];
        tr.appendChild(td);
        table.appendChild(tr);
    }

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function set_onclick_events() {
    document.getElementById('login-button').onclick = login;
    document.getElementById('player').addEventListener('click', function(event) {
        select_opponent('player');
    });
    document.getElementById('ai').addEventListener('click', function(event) {
        select_opponent('ai');
    });
    document.getElementsByClassName('config-btn')[0].onclick = start_game;
    document.getElementsByClassName('btn-start')[0].onclick = start_game;
    document.getElementsByClassName('btn-config')[0].onclick = show_config;
    document.getElementsByClassName('btn-rules')[0].onclick = show_rules;
    document.getElementsByClassName('btn-leaderboard')[0].onclick = show_leaderboard;
    document.getElementsByClassName('btn-quit')[0].addEventListener('click', function(event) {
        quit_game('show');
    });
    document.getElementsByClassName('no-btn')[0].addEventListener('click', function(event) {
        quit_game('no');
    });
    document.getElementsByClassName('yes-btn')[0].addEventListener('click', function(event) {
        quit_game('yes');
    });
    document.getElementsByClassName('btn-logout')[0].addEventListener('click', function(event) {
        window.location.reload();
    });

}
