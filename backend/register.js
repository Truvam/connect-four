"use strict";

const fs = require('fs');
const crypto = require('crypto');

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
        if (decipher(users[nick]) != pass) {
            answer.error = "User registered with a different password";
            answer.status = 401;
        }
        else {
            answer.status = 200;
            answer.json = {};
        }
    } else {
        users[nick] = cipher(pass);
        answer.status = 200;
        answer.json = {};
    }

    const json = JSON.stringify(users);
    fs.writeFileSync('passwd.json', json);
    return answer;
}

function cipher(value) {
    let key = crypto.createCipher('aes-128-cbc', 'G)yNT@d]}#zz"`9%');
    let hash = key.update(value, 'utf8', 'hex')
    hash += key.final('hex');

    return hash
}

function decipher(hash) {
    let key = crypto.createDecipher('aes-128-cbc', 'G)yNT@d]}#zz"`9%');
    let value = key.update(hash, 'hex', 'utf8')
    value += key.final('utf8');

    return value
}