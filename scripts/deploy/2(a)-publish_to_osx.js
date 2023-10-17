const { ethers } = require("hardhat");
const {
    PluginRepoFactory__factory,
} = require('@aragon/osx-ethers');
const { uploadToIPFS } = require("../utils/ipfs-upload");
const fs = require('node:fs');
const {demand} = require("../utils/config");

const PLUGIN_REPO_FACTORY_ADDRESS = demand("PLUGIN_REPO_FACTORY_ADDRESS");
const DAWNPOOL_SETTINGS_SETUP_ADDRESS = demand("DAWNPOOL_SETTINGS_SETUP_ADDRESS");

async function publishToOsx() {
    const [owner] = await ethers.getSigners();
    console.log("using " + owner.address + " to send tx");
    const metaData = await fs.readFileSync("./artifacts/contracts/DawnPoolSettingsSetup.sol/DawnPoolSettingsSetup.json");
    // Upload the metadata
    const releaseMetadataURI = `ipfs://${await uploadToIPFS(
        metaData.toString()
    )}`;
    const buildMetadataURI = releaseMetadataURI;
    console.log(`Uploaded metadata of release 1: ${releaseMetadataURI}`);
    console.log(`Uploaded metadata of build 1: ${buildMetadataURI}`);
    const pluginRepoFactory = PluginRepoFactory__factory.connect(PLUGIN_REPO_FACTORY_ADDRESS, owner);
    const tx = await pluginRepoFactory.createPluginRepoWithFirstVersion(
        "dawnpool-settings",
        DAWNPOOL_SETTINGS_SETUP_ADDRESS,
        owner.address,
        Buffer.from(releaseMetadataURI),
        Buffer.from(buildMetadataURI)
    );
    console.log(await tx.wait());
}

publishToOsx()
