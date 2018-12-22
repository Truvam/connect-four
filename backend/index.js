"use strict";

const http = require('http');
const conf = require('./conf.js');
let url = require('url');

const register = require('./register.js');
const ranking = require('./ranking.js');
const join = require('./join.js');
const updater = require('./updater.js');
const leave = require('./leave.js');
const notify = require('./notify.js');

const headers = {
    json: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    },
    sse: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
    }
};


http.createServer(function (request, response) {
    const pathname = url.parse(request.url, true).pathname;
    let answer = {};

    switch (request.method) {
        case 'GET':
            doGet(pathname, request, response, function (answer) {
                console.log("GAns: ", answer);
            })
            break;
        case 'POST':
            doPost(pathname, request, function (answer) {
                console.log("POans: ", answer);
                write_response(response, answer);
            });
            break;
        default:
            answer.status = 400;
            break;
    }

}).listen(conf.port);


function doGet(pathname, request, response, callback) {
    let answer = {};

    switch (pathname) {
        case '/update':
            let game = request.url.match('(?<=game=).*');
            let nick = request.url.match('(?<=nick=)(.*?)(?=&)');
            answer.style = 'sse';
            answer.status = 200;

            if (game[0].length < 32) {
                answer.status = 400;
                answer.error = "Invalid game reference";
                setImmediate(() => updater.update(answer.status, headers[answer.style], {
                    "error": answer.error
                }));
            } else {
                updater.set_game(game[0]);
                updater.set_nicks(nick[0]);
                updater.incr_players();

                if (updater.get_n_players() == 1) updater.set_turn(nick[0]);
                else updater.create_board();

                updater.remember(response);
                request.on('close', () => updater.forget(response));

                if (updater.get_n_players() > 1)
                    setImmediate(() => updater.update(answer.status, headers[answer.style], updater.get_game_info()));
            }

            break;
        default:
            answer.status = 400;
            break;
    }

    callback(answer);
}


function doPost(pathname, request, callback) {
    let answer = {};
    let json_string = '';

    switch (pathname) {
        case '/register':
            json_string = '';
            request.on('data', function (data) {
                json_string += data;
            });
            request.on('end', function () {
                register.register(JSON.parse(json_string), function (answer) {
                    callback(answer);
                });
            });
            break;
        case '/ranking':
            json_string = '';
            request.on('data', function (data) {
                json_string += data;
            });
            request.on('end', function () {
                ranking.ranking(JSON.parse(json_string), function (answer) {
                    callback(answer);
                });
            });
            break;
        case '/join':
            json_string = '';
            request.on('data', function (data) {
                json_string += data;
            });
            request.on('end', function () {
                join.join(JSON.parse(json_string), updater.get_game_info(), function (answer) {
                    callback(answer);
                });
            });
            break;
        case '/leave':
            json_string = '';
            request.on('data', function (data) {
                json_string += data;
            });
            request.on('end', function () {
                leave.leave(JSON.parse(json_string), updater.get_game_info(), function (answer) {
                    callback(answer);
                    setImmediate(() => updater.update(answer.status, headers[answer.style], answer.winner));
                });
            });
            break;
        case '/notify':
            json_string = '';
            request.on('data', function (data) {
                json_string += data;
            });
            request.on('end', function () {
                notify.notify(JSON.parse(json_string), updater.get_game_info(), function (answer) {
                    callback(answer);
                    if (answer.status == 200)
                        setImmediate(() => updater.update(answer.status, headers[answer.style], updater.get_game_info()));
                });
            });
            break;
        default:
            answer.status = 400;
            break;
    }

    callback(answer);
}


function write_response(response, answer) {
    if (answer.status != undefined) {
        response.writeHead(answer.status, headers[answer.style]);
        if (answer.status == 200) response.end(JSON.stringify(answer.json));
        else response.end(JSON.stringify({
            "error": answer.error
        }));
    }
}