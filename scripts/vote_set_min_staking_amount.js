const {web3} = require("./utils/useWeb3");
const {ethers} = require("hardhat");
const {voteChangeDawnPoolSettings} = require("./utils/vote_change_settings");

async function voteToSetMinStakingAmount() {
    const contractName = "DawnPoolTest";
    const encodedSetMinStakingAmount = web3.eth.abi.encodeFunctionCall({
        name: "setMinStakingAmount",
        type: 'function',
        inputs: [{
            type: 'uint256',
            name: 'minStakingAmount'
        }]
    }, [ethers.utils.parseEther("2")]);
    console.log("encodedSetMinStakingAmount: ", encodedSetMinStakingAmount);
    const metaData = {
        title: "Set min staking amount proposal",
        summary: "This is change dawnpool settings proposal",
        description: "Set min staking amount to 2 ether",
        resources: [
            {
                url: "https://test.com",
                name: "Ray",
            },
        ],
    }
    await voteChangeDawnPoolSettings(contractName, encodedSetMinStakingAmount, metaData);
}

voteToSetMinStakingAmount()
