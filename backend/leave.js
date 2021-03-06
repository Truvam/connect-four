const ranking = require('./ranking.js');

module.exports.leave = function (body, game_info, callback) {
    let answer = {};

    try {
        if(game_info.players < 2) {
            answer.winner = {"winner": null};
            answer.style = 'sse';
        }
        else {
            if(body.nick == game_info.nick[0]) answer.winner = {"winner": game_info.nick[1]};
            else answer.winner = {"winner": game_info.nick[0]};
            game_info.winner = answer.winner.winner;
            ranking.insert_ranking(game_info);
            answer.style = 'json';
        }
    
        answer.status = 200;
        answer.json = {};
        console.log("LEans: ", answer);
    } catch (error) {
        answer.status = 500;
        answer.error = 'Unable to leave game';
    }
    

    callback(answer);
}