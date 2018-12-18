"use strict";

const fs = require('fs');

function register(body, callback) {
    let answer = {}

    answer = verify_login(body.nick, body.pass)
    answer.style = 'json';
    console.log("Rans: ", answer)

    callback(answer);
}
module.exports.register = register;

function verify_login(nick, pass) {
    let answer = {}

    const data = fs.readFileSync('passwd.json');
    let users = JSON.parse(data);
    if (users.hasOwnProperty(nick)) {
        if (users[nick] != pass) {
            answer.error = "User registered with a different password";
            answer.status = 401;
        }
        else {
            answer.status = 200;
            answer.json = {};
        }
    } else {
        users[nick] = pass;
        answer.status = 200;
        answer.json = {};
    }

    const json = JSON.stringify(users);
    fs.writeFileSync('passwd.json', json);
    return answer;
}