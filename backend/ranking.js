"use strict";

const fs = require('fs');

module.exports.ranking = function (body, callback) {
    let answer = {};

    if (body.hasOwnProperty('size')) {
        if (body.size.hasOwnProperty('rows') && body.size.hasOwnProperty('columns')) {
            answer = get_ranking(body.size.rows, body.size.columns);
            answer.status = 200;
        } else {
            answer.status = 401;
            answer.error = "Invalid size";
        }
    } else {
        answer.status = 401;
        answer.error = "Undefined size";
    }

    answer.style = 'json';
    console.log("RKans: ", answer);

    callback(answer);
}

module.exports.insert_ranking = function (game_info) {
    let json = {};
    let player = {};
    let player2 = {};

    try {
        let data = fs.readFileSync('ranking/ranking' + game_info.size.rows + '-' + game_info.size.columns + '.json');
        data = JSON.parse(data);

        player = find_player(data, game_info.nick[0]);
        if(player) {
            if (game_info.nick[0] == game_info.winner) player.victories++;
            player.games++;
        }
        else {
            player.nick = game_info.nick[0];
            if (game_info.nick[0] == game_info.winner) player.victories = 1;
            else player.victories = 0;
            player.games = 1;
            data.ranking.push(player);
        }
        
        player = find_player(data, game_info.nick[1]);
        if(player) {
            if (game_info.nick[1] == game_info.winner) player.victories++;
            player.games++;
        }
        else {
            player2.nick = game_info.nick[1];
            if (game_info.nick[1] == game_info.winner) player2.victories = 1;
            else player2.victories = 0;
            player2.games = 1;
            data.ranking.push(player2);
        }

        json = JSON.stringify(data);
        fs.writeFileSync('ranking/ranking' + game_info.size.rows + '-' + game_info.size.columns + '.json', json);
    } catch (error) {
        console.log(error)
        fs.writeFileSync('ranking/ranking' + game_info.size.rows + '-' + game_info.size.columns + '.json', JSON.stringify({"ranking":[]}));
        let data = fs.readFileSync('ranking/ranking' + game_info.size.rows + '-' + game_info.size.columns + '.json');
        data = JSON.parse(data);

        player.nick = game_info.nick[0];
        if (game_info.nick[0] == game_info.winner) player.victories = 1;
        else player.victories = 0;
        player.games = 1;
        data.ranking.push(player);

        player2.nick = game_info.nick[1];
        if (game_info.nick[1] == game_info.winner) player2.victories = 1;
        else player2.victories = 0;
        player2.games = 1;
        data.ranking.push(player2);

        json = JSON.stringify(data);
        fs.writeFileSync('ranking/ranking' + game_info.size.rows + '-' + game_info.size.columns + '.json', json);
    }
}

function get_ranking(rows, columns) {
    let answer = {};

    try {
        const data = fs.readFileSync('ranking/ranking' + rows + '-' + columns + '.json');
        answer.json = JSON.parse(data);
    } catch (error) {
        console.log(error);
        answer.json = {};
    }


    return answer;
}

function find_player(data, nick) {
    let player = data.ranking.find(function (item) {
        return item.nick == nick
    })

    if (player) {
        return player;
    }
    return null;
}