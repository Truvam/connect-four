"use strict";

let responses = [];
let game_info = {
    "players": 0
};

module.exports.remember = function (response) {
    responses.push(response);
}

module.exports.forget = function (response) {
    let pos = responses.findIndex((resp) => resp === response);
    if (pos > -1)
        responses.splice(pos, 1);
}

module.exports.update = function (status, header, data) {
    console.log("UPA: ", data);
    if (data.hasOwnProperty('column')) {
        place_piece(data.column);
        check_winner();
    }
    for (let response of responses) {
        if (!data.hasOwnProperty('column'))
            response.writeHead(status, header);
        response.write('data: ' + JSON.stringify(data) + '\n\n');
    }
}

module.exports.set_game = function (game) {
    game_info.game = game;
}

module.exports.get_game_info = function () {
    return game_info;
}

module.exports.set_nicks = function (nick) {
    if (game_info.hasOwnProperty('nick'))
        game_info.nick[1] = nick;
    else
        game_info.nick = [nick, null];
}

module.exports.incr_players = function () {
    game_info.players++;
}

module.exports.get_n_players = function () {
    return game_info.players;
}

module.exports.set_turn = function (nick) {
    game_info.turn = nick;
}

module.exports.create_board = function () {
    game_info.board = Array.from({
        length: game_info.size.rows
    }, () => Array.from({
        length: game_info.size.columns
    }, () => null));
}

function place_piece(column) {
    for (let i = game_info.size.rows - 1; i >= 0; i--) {
        if (game_info.board[i][column] === null) {
            if (game_info.turn == game_info.nick[1]) game_info.board[i][column] = game_info.nick[0];
            else game_info.board[i][column] = game_info.nick[1];
            break;
        }
    }
}

function check_winner() {
    if (is_draw()) {
        game_info.winner = null;
        delete game_info.turn;
    } else {
        let winner = who_won();
        if (winner != null) {
            game_info.winner = winner;
            delete game_info.turn;
        }
    }
}

function is_draw() {
    for (let i = 0; i < game_info.size.rows; i++) {
        for (let j = 0; j < game_info.size.columns; j++) {
            if (game_info.board[i][j] == null)
                return false
        }
    }
    return true;
}

function who_won() {
    let cont_r = 0;
    let cont_b = 0;
    for (let i = 0; i < game_info.size.rows; i++) { // HORIZONTAL
        for (let j = 0; j < game_info.size.columns - 3; j++) {
            for (let k = j; k < j + 4; k++) {
                if (game_info.board[i][k] == game_info.nick[0])
                    cont_r += 1;
                else if (game_info.board[i][k] == game_info.nick[1])
                    cont_b += 1;
            }
            if (cont_b == 4)
                return game_info.nick[1];
            else if (cont_r == 4)
                return game_info.nick[0]
            cont_r = 0;
            cont_b = 0;
        }
    }

    for (let j = 0; j < game_info.size.columns; j++) { // VERTICAL
        for (let i = 0; i < game_info.size.rows - 3; i++) {
            for (let k = i; k < i + 4; k++) {
                if (game_info.board[k][j] == game_info.nick[0])
                    cont_r += 1;
                else if (game_info.board[k][j] == game_info.nick[1])
                    cont_b += 1;
            }
            if (cont_b == 4)
                return game_info.nick[1];
            else if (cont_r == 4)
                return game_info.nick[0];
            cont_r = 0;
            cont_b = 0;
        }
    }

    for (let i = 3; i < game_info.size.rows; i++) { // DIAGONAL RIGHT
        let z = i;
        for (let j = 0; j < game_info.size.columns - 3; j++) {
            for (let k = j; k < j + 4; k++) {
                if (game_info.board[z][k] == game_info.nick[0])
                    cont_r += 1;
                else if (game_info.board[z][k] == game_info.nick[1])
                    cont_b += 1;
                z -= 1;
            }
            z = i;
            if (cont_b == 4)
                return game_info.nick[1];
            else if (cont_r == 4)
                return game_info.nick[0];
            cont_r = 0;
            cont_b = 0;
        }
    }

    for (let i = 3; i < game_info.size.rows; i++) { // DIAGONAL LEFT
        let z = i;
        for (let j = game_info.size.columns - 1; j > game_info.size.columns - 5; j--) {
            for (let k = j; k > j - 4; k--) {
                if (game_info.board[z][k] == game_info.nick[0])
                    cont_r += 1;
                else if (game_info.board[z][k] == game_info.nick[1])
                    cont_b += 1;
                z -= 1;
            }
            z = i;
            if (cont_b == 4)
                return game_info.nick[1];
            else if (cont_r == 4)
                return game_info.nick[0];
            cont_r = 0;
            cont_b = 0;
        }
    }

    return null;
}