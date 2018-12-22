module.exports.leave = function (body, game_info, callback) {
    let answer = {};

    if(game_info.players < 2) {
        answer.winner = {"winner": null};
        answer.style = 'sse';
    }
    else {
        if(body.nick == game_info.nick[0]) answer.winner = {"winner": game_info.nick[1]};
        else answer.winner = {"winner": game_info.nick[0]};
        answer.style = 'json';
    }

    answer.status = 200;
    answer.json = {};
    console.log("LEans: ", answer);

    callback(answer);
}