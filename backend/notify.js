"use strict";

module.exports.notify = function (body, game_info, callback) {
    let answer = {};

    try {
        if (body.nick != game_info.turn) {
            answer.error = "Not your turn to play";
            answer.status = 401;
        } else if (body.column < 0) {
            answer.error = "Column reference is negative";
            answer.status = 401;
        } else {
            answer.json = {};
            answer.status = 200;
            game_info.column = body.column;
            if (game_info.turn == game_info.nick[0]) game_info.turn = game_info.nick[1];
            else game_info.turn = game_info.nick[0];
        }
    } catch (error) {
        answer.status = 500;
        answer.error = 'Unable to notify';
    }
    

    answer.style = 'json';
    console.log("NOans: ", answer);

    callback(answer);
}