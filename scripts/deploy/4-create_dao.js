const {
    DaoCreationSteps,
    TokenVotingClient,
    VotingMode,
} = require("@aragon/sdk-client");
const { initDaoContext } = require("../utils/init_dao_context");
const {uploadToIPFS} = require("../utils/ipfs-upload");
const {ethers} = require("hardhat");
const {demand} = require("../utils/config");

const DAWN_STORAGE_ADDRESS = demand("DAWN_STORAGE_ADDRESS");
const DAWNPOOL_SETTINGS_PLUGIN_REPO_ADDRESS = demand("DAWNPOOL_SETTINGS_PLUGIN_REPO_ADDRESS");
const DAO_ENS_DOMAIN = demand("DAO_ENS_DOMAIN");
const DAO_TOKEN_NAME = demand("DAO_TOKEN_NAME");
const DAO_TOKEN_SYMBOL = demand("DAO_TOKEN_SYMBOL");

async function createDao() {
    // Instantiate the general purpose client from the Aragon OSx SDK context.
    const { daoSDKClient, daoContext } = initDaoContext();
    const metadata = {
        name: "dawnpool-dao-test",
        description: "dawnpool dao test",
        avatar: "https://raw.githubusercontent.com/okx-dao/dawnpool-dao/main/dawnpool-icon.jpeg",
        links: [{
            name: "DawnPool DAO",
            url: "https://github.com/okx-dao/dawnpool-dao",
        }],
    };
    const tokenHolder = await daoContext.signer.getAddress();
    // You need at least one plugin in order to create a DAO. In this example, we'll use the TokenVoting plugin, but feel free to install whichever one best suites your needs. You can find resources on how to do this in the plugin sections.
    // These would be the plugin params if you need to mint a new token for the DAO to enable TokenVoting.
    const tokenVotingPluginInstallParams = {
        votingSettings: {
            minDuration: 60 * 60, // seconds
            minParticipation: 0.15, // 15%
            supportThreshold: 0.5, // 50%
            minProposerVotingPower: BigInt("5000"), // default 0
            votingMode: VotingMode.EARLY_EXECUTION, // default is STANDARD. other options: EARLY_EXECUTION, VOTE_REPLACEMENT
        },
        newToken: {
            name: DAO_TOKEN_NAME, // the name of your token
            symbol: DAO_TOKEN_SYMBOL, // the symbol for your token. shouldn't be more than 5 letters
            decimals: 18, // the number of decimals your token uses
            balances: [
                { // Defines the initial balances of the new token
                    address: tokenHolder, // address of the account to receive the newly minted tokens
                    balance: BigInt(10_000), // amount of tokens that address should receive
                },
            ],
        },
    };

    // Creates a TokenVoting plugin client with the parameteres defined above (with an existing token).
    const tokenVotingInstallItem = TokenVotingClient.encoding
        .getPluginInstallItem(tokenVotingPluginInstallParams, "goerli");
    console.log(tokenVotingInstallItem);
    const dawnPoolSettingsInitData = ethers.utils.defaultAbiCoder.encode(["address"], [DAWN_STORAGE_ADDRESS]);
    const dawnPoolSettingsInstallItem = {
        id: DAWNPOOL_SETTINGS_PLUGIN_REPO_ADDRESS,
        data: Uint8Array.from(Buffer.from(dawnPoolSettingsInitData.substring(2), 'hex'))
    };
    // Through pinning the metadata in IPFS, we can get the IPFS URI. You can read more about it here: https://docs.ipfs.tech/how-to/pin-files/
    const metadataUri = await uploadToIPFS(metadata);
    const createDaoParams = {
        metadataUri,
        ensSubdomain: DAO_ENS_DOMAIN, // my-org.dao.eth
        plugins: [tokenVotingInstallItem, dawnPoolSettingsInstallItem], // plugin array cannot be empty or the transaction will fail. you need at least one governance mechanism to create your DAO.
    };

    // Estimate how much gas the transaction will cost.
    const estimatedGas = await daoSDKClient.estimation.createDao(
        createDaoParams,
    );
    console.log({ avg: estimatedGas.average, maximum: estimatedGas.max });

    // Create the DAO.
    const steps = daoSDKClient.methods.createDao(createDaoParams);

    for await (const step of steps) {
        try {
            switch (step.key) {
                case DaoCreationSteps.CREATING:
                    console.log({ txHash: step.txHash });
                    break;
                case DaoCreationSteps.DONE:
                    console.log({
                        daoAddress: step.address,
                        pluginAddresses: step.pluginAddresses,
                    });
                    break;
            }
        } catch (err) {
            console.error(err);
        }
    }
}

createDao()
