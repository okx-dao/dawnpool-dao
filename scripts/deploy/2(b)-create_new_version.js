const { ethers } = require("hardhat");
const {
    PluginRepo__factory,
} = require('@aragon/osx-ethers');
const { uploadToIPFS } = require("../utils/ipfs-upload");
const fs = require('node:fs');
const {demand} = require("../utils/config");

const DAWNPOOL_SETTINGS_SETUP_ADDRESS = demand("DAWNPOOL_SETTINGS_SETUP_ADDRESS");
const DAWNPOOL_SETTINGS_PLUGIN_REPO_ADDRESS = demand("DAWNPOOL_SETTINGS_PLUGIN_REPO_ADDRESS");

async function publishToOsx() {
    const [owner] = await ethers.getSigners();
    console.log("using " + owner.address + " to send tx");
    const metaData = await fs.readFileSync("./artifacts/contracts/DawnPoolSettingsSetup.sol/DawnPoolSettingsSetup.json");
    // Upload the metadata
    const releaseMetadataURI = await uploadToIPFS(
        metaData.toString()
    );
    const buildMetadataURI = releaseMetadataURI;
    const buildVersion = 1;
    const releaseVersion = 2;
    console.log(`Uploaded metadata of release ${releaseVersion}: ${releaseMetadataURI}`);
    console.log(`Uploaded metadata of build ${buildVersion}: ${buildMetadataURI}`);
    const pluginRepo = PluginRepo__factory.connect(DAWNPOOL_SETTINGS_PLUGIN_REPO_ADDRESS, owner);
    const tx = await pluginRepo.createVersion(
        `${releaseVersion}`,
        DAWNPOOL_SETTINGS_SETUP_ADDRESS,
        Buffer.from(releaseMetadataURI),
        Buffer.from(buildMetadataURI)
    );
    console.log((await tx.wait()));
}

publishToOsx()
