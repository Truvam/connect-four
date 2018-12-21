"use strict";

let responses = [];
let game_info = {"players" : 0};

module.exports.remember = function(response) {
    responses.push(response);
}

module.exports.forget = function(response) {
    let pos = responses.findIndex((resp) => resp === response);
    if(pos > -1)
      responses.splice(pos,1);
}

module.exports.update = function(status, header, data) {
    console.log("UPA: ", data);
    for(let response of responses) {
        response.writeHead(status, header);
        response.write('data: ' + JSON.stringify(data) + '\n\n');
    } 
}

module.exports.set_game = function(game) {
    game_info.game = game;
}

module.exports.get_game_info = function() {
    return game_info;
}

module.exports.incr_players = function() {
    game_info.players++;
}

module.exports.get_n_players = function() {
    return game_info.players;
}

module.exports.set_turn = function(nick) {
    game_info.turn = nick;
}