const {web3} = require("./useWeb3");
const {encodePacked, keccak256} = require("web3-utils");
const {demand} = require("./config");
const {newProposal} = require("./new_proposal");

async function voteChangeDawnPoolSettings(contractName, operateData, metaData) {
    const contractHash = keccak256(encodePacked('contract.address', contractName))
    console.log("contractHash: ", contractHash);
    const encodedSetDawnPoolParams = web3.eth.abi.encodeFunctionCall({
        name: "setDawnPoolParams",
        type: 'function',
        inputs: [{
            type: 'bytes32',
            name: 'contractHash'
        }, {
            type: 'bytes',
            name: 'data'
        }]
    }, [contractHash, operateData]);
    console.log("encodedSetDawnPoolParams: ", encodedSetDawnPoolParams);
    const dawnPoolSettingsAddr = demand("DAWNPOOL_SETTINGS_ADDRESS");
    const actions = [{
        to: dawnPoolSettingsAddr,
        value: 0n,
        data: Uint8Array.from(Buffer.from(encodedSetDawnPoolParams.substring(2), 'hex')),
    }];
    console.log(actions);
    await newProposal(actions, metaData);
}

module.exports = {
    voteChangeDawnPoolSettings
}
