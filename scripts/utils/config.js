const dotenv = require('dotenv');

dotenv.config();

function get(param) {
    return process.env[param];
}

function demand(param) {
    const val = get(param);
    if(!val || val.length == 0) {
        throw new Error(`${param} not defined`);
    }
    return val;
}

module.exports = {
    get,
    demand
}
