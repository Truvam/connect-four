"use strict";

const crypto = require('crypto');

function join(body, callback) {
    let answer = {};

    answer = create_hash(body);
    answer.style = 'json';
    console.log("Rans: ", answer);

    callback(answer);
}
module.exports.join = join;

function create_hash(body) {
    let answer = {};
    
    try {
        body.time = Date.now();
        let hash = crypto.createHash('md5').update(JSON.stringify(body)).digest("hex");

        answer.json = {"game": hash};
        answer.status = 200;
    } catch (error) {
        answer.error = "Unable to create game hash";
        answer.status = 400;
    }
    

    return answer;
}