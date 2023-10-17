const { ethers } = require('hardhat');
const {web3} = require("../utils/useWeb3");
const { keccak256, encodePacked } = require('web3-utils');
const {demand} = require("../utils/config");

const DAWN_STORAGE_ADDRESS = demand("DAWN_STORAGE_ADDRESS");
const PROXY_ADMIN_ADDRESS = demand("PROXY_ADMIN_ADDRESS");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account:', deployer.address);
    console.log('Account balance:', (await deployer.getBalance()).toString());
    const contractName = "DawnPoolTest";
    const DawnPoolTest = await ethers.getContractFactory(contractName);
    console.log("Deploying DawnPoolTest...");
    const dawnPoolTest = await DawnPoolTest.deploy();
    await dawnPoolTest.deployed();
    console.log("DawnPoolTest deployed to:", dawnPoolTest.address);
    const TransparentUpgradeableProxy = await ethers.getContractFactory("TransparentUpgradeableProxy");
    const initData = web3.eth.abi.encodeFunctionCall({
        name: "initialize",
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'dawnStorage'
        }]
    }, [DAWN_STORAGE_ADDRESS]);
    console.log(`init data: ${initData}`);
    console.log(dawnPoolTest.address, deployer.address);
    const dawnPoolTestProxy = await TransparentUpgradeableProxy.deploy(
        dawnPoolTest.address,
        PROXY_ADMIN_ADDRESS,
        initData
    );
    console.log("DawnPoolTest proxy deployed to:", dawnPoolTestProxy.address);
    const dawnStorage = await ethers.getContractAt("DawnStorage", DAWN_STORAGE_ADDRESS);
    await dawnStorage.setAddress(keccak256(encodePacked('contract.address', contractName)), dawnPoolTestProxy.address);
    await dawnStorage.setBool(keccak256(encodePacked('contract.exists', dawnPoolTestProxy.address)), true);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
