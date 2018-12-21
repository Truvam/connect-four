"use strict";

module.exports.notify = function(body, game_info, callback) {
    let answer = {};

    if(body.nick != game_info.turn) {
        answer.error = "Not your turn to play";
        answer.status = 401;
    }
    else if(body.column < 0) {
        answer.error = "Column reference is negative";
        answer.status = 401; 
    }
    else {
        answer.json = {};
        answer.status = 200;
    }

    answer.style = 'json';
    console.log("NOans: ", answer);

    callback(answer);
}