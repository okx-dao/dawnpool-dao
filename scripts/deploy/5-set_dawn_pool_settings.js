const {ethers} = require("hardhat");
const {keccak256, encodePacked} = require("web3-utils");
const {demand} = require("../utils/config");

const DAWNPOOL_SETTINGS_ADDRESS = demand("DAWNPOOL_SETTINGS_ADDRESS");
const DAWN_STORAGE_ADDRESS = demand("DAWNPOOL_SETTINGS_ADDRESS");

async function setDawnPoolSettingsAddress() {
    const dawnPoolSettingsName = "DawnPoolSettings";
    const dawnStorage = await ethers.getContractAt("DawnStorage", DAWN_STORAGE_ADDRESS);
    let tx = await dawnStorage.setAddress(keccak256(encodePacked('contract.address', dawnPoolSettingsName)), DAWNPOOL_SETTINGS_ADDRESS);
    console.log(tx.hash)
    tx = await dawnStorage.setBool(keccak256(encodePacked('contract.exists', DAWNPOOL_SETTINGS_ADDRESS)), true);
    console.log(tx.hash)
}

setDawnPoolSettingsAddress()
