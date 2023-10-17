const {web3} = require("./useWeb3");
const {demand} = require("./config");
const {newProposal} = require("./new_proposal");

async function voteChangeProxyAdmin(proxy, newAdmin, metaData) {
    const encodedChangeProxyAdmin = web3.eth.abi.encodeFunctionCall({
        name: "changeProxyAdmin",
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'proxy'
        }, {
            type: 'address',
            name: 'newAdmin'
        }]
    }, [proxy, newAdmin]);
    console.log("encodedChangeProxyAdmin: ", encodedChangeProxyAdmin);
    const proxyAdminAddress = demand("PROXY_ADMIN_ADDRESS");
    const actions = [{
        to: proxyAdminAddress,
        value: 0n,
        data: Uint8Array.from(Buffer.from(encodedChangeProxyAdmin.substring(2), 'hex')),
    }];
    console.log(actions);
    await newProposal(actions,metaData);
}

async function voteUpgrade(proxy, implementation, data, metaData) {
    let encodedUpgradeFunction;
    if(data) {
        encodedUpgradeFunction = web3.eth.abi.encodeFunctionCall({
            name: "upgradeAndCall",
            type: 'function',
            inputs: [{
                type: 'address',
                name: 'proxy'
            }, {
                type: 'address',
                name: 'implementation'
            }, {
                type: 'bytes',
                name: 'data'
            }]
        }, [proxy, implementation, data]);
    } else {
        encodedUpgradeFunction = web3.eth.abi.encodeFunctionCall({
            name: "upgrade",
            type: 'function',
            inputs: [{
                type: 'address',
                name: 'proxy'
            }, {
                type: 'address',
                name: 'implementation'
            }]
        }, [proxy, implementation]);
    }
    console.log("encodedUpgradeFunction: ", encodedUpgradeFunction);
    const proxyAdminAddress = demand("PROXY_ADMIN_ADDRESS");
    const actions = [{
        to: proxyAdminAddress,
        value: 0n,
        data: Uint8Array.from(Buffer.from(encodedUpgradeFunction.substring(2), 'hex')),
    }];
    console.log(actions);
    await newProposal(actions,metaData);
}

module.exports = {
    voteChangeProxyAdmin,
    voteUpgrade,
}
