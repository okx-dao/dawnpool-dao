const { ethers } = require('hardhat');
const {keccak256, encodePacked} = require("web3-utils");
const {demand} = require("../utils/config");

const DAO_ADDRESS = demand("DAO_ADDRESS");
const DAWN_STORAGE_ADDRESS = demand("DAWN_STORAGE_ADDRESS");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account:', deployer.address);
    console.log('Account balance:', (await deployer.getBalance()).toString());
    const ProxyAdmin = await ethers.getContractFactory('ProxyAdmin');
    const proxyAdmin = await ProxyAdmin.deploy(DAO_ADDRESS);
    console.log('ProxyAdmin address:', proxyAdmin.address);
    const proxyAdminName = "ProxyAdmin";
    const dawnStorage = await ethers.getContractAt("DawnStorage", DAWN_STORAGE_ADDRESS);
    let tx = await dawnStorage.setAddress(
        keccak256(encodePacked('contract.address', proxyAdminName)),
        proxyAdmin.address
    );
    console.log(tx.hash)
    tx = await dawnStorage.setBool(keccak256(encodePacked('contract.exists', proxyAdmin.address)), true);
    console.log(tx.hash)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
