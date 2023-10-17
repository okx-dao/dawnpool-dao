// scripts/deploy.js
const { ethers } = require('hardhat');
const {keccak256, encodePacked} = require("web3-utils");

async function changeAdmin() {
    const dawnPoolTestProxyAddr = "0xc5b3E696931651C3838Fb4C480fcEC64a54a70B9";
    const transparentUpgradeableProxy = await ethers.getContractAt(
        'ITransparentUpgradeableProxy',
        dawnPoolTestProxyAddr
    );
    const dawnPoolSettingsAddr = "0xc650437c50252b722C2C1bba5C0CAe206B357fEa";
    const tx = await transparentUpgradeableProxy.changeAdmin(dawnPoolSettingsAddr);
    console.log(tx.hash)
}

async function setDawnPoolTestAddress() {
    const dawnPoolTestProxyAddr = "0xc5b3E696931651C3838Fb4C480fcEC64a54a70B9";
    const dawnPoolTestName = "DawnPoolTest";
    const dawnStorageAddr = "0x76e50683E5A6594a80924875B814ebC0015A6c23";
    const dawnStorage = await ethers.getContractAt("DawnStorage", dawnStorageAddr);
    let tx = await dawnStorage.setAddress(keccak256(encodePacked('contract.address', dawnPoolTestName)), dawnPoolTestProxyAddr);
    console.log(tx.hash)
    tx = await dawnStorage.setBool(keccak256(encodePacked('contract.exists', dawnPoolTestProxyAddr)), true);
    console.log(tx.hash)
}

async function main() {
    // await setDawnPoolTestAddress()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
