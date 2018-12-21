"use strict";

const crypto = require('crypto');

function join(body, game_info, callback) {
    let answer = {};

    if(game_info.hasOwnProperty('game')) {
        body.game = game_info.game;
        game_info.size = body.size;
    }
    answer = create_hash(body);
    answer.style = 'json';
    console.log("Rans: ", answer);

    callback(answer);
}
module.exports.join = join;

function create_hash(body) {
    let answer = {};
    if(body.hasOwnProperty('game')) {
        answer.json = {"game": body.game};
        answer.status = 200;
    }
    else {
        try {
            body.time = Date.now();
            let hash = crypto.createHash('md5').update(JSON.stringify(body)).digest("hex");
            answer.json = {"game": hash};
            answer.status = 200;
        } catch (error) {
            answer.error = "Unable to create game hash";
            answer.status = 400;
        }
    }

    return answer;
}