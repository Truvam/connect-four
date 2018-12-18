"use strict";

const fs = require('fs');

function ranking(body, callback) {
    let answer = {}

    if (body.hasOwnProperty('size')) {
        if (body.size.hasOwnProperty('rows') && body.size.hasOwnProperty('columns')) {
            answer = get_ranking(body.size.rows, body.size.columns)
            answer.status = 200;
        }
        else {
            answer.status = 401;
            answer.error = "Invalid size";
        }
    } else {
        answer.status = 401;
        answer.error = "Undefined size";
    }

    answer.style = 'json';
    console.log("RKans: ", answer)

    callback(answer);
}
module.exports.ranking = ranking;

function get_ranking(rows, columns) {
    let answer = {}

    const data = fs.readFileSync('ranking.json');
    answer.json = JSON.parse(data);

    return answer;
}