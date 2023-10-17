const { web3 } = require("./utils/useWeb3")

async function getStoragedParam() {
    const admin = await web3.eth.getStorageAt(
        "0xc5b3E696931651C3838Fb4C480fcEC64a54a70B9",
        "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103",
    );
    console.log(admin);
    const implementation = await web3.eth.getStorageAt(
        "0xc5b3E696931651C3838Fb4C480fcEC64a54a70B9",
        "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
    )
    console.log(implementation);
}

getStoragedParam()
