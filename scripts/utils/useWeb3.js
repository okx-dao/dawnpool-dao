const {Web3} = require("web3");
const {demand} = require("./config");

const web3 = new Web3(demand("WEB3_PROVIDER"));

module.exports = {
    web3
}
