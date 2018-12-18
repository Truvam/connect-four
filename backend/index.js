"use strict";


const http = require('http');
const conf = require('./conf.js');
const register = require('./register.js');
let url = require('url');


const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    },
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
            console.log('GET');
            break;
        case 'POST':
            doPost(pathname, request, function(answer) {
                console.log("SAns: ", answer);
                write_response(response, answer);
            });
            
            break;
        default:
            answer.status = 400;
            break;
    }   

}).listen(conf.port);


function doPost(pathname, request, callback) {
    let answer = {};

    switch (pathname) {
        case '/register':
            let json_string = '';
            request.on('data', function (data) {
                json_string += data;
            });
            request.on('end', function () {
                register.register(JSON.parse(json_string), function(answer) {
                    callback(answer);
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
    if(answer.status != undefined) {
        response.writeHead(answer.status, headers[answer.style]);
        if(answer.status == 200) response.end(JSON.stringify({}));
        else response.end(JSON.stringify({"error": answer.error}));
    } 
}