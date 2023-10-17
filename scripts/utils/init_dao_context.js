const { Wallet } = require("ethers");
const { Client, Context } = require("@aragon/sdk-client");
const { demand } = require("./config");

const provider = demand("WEB3_PROVIDER");
const network = demand("NETWORK");
const privateKey = demand("PRIVATE_KEY");

const initDaoContext = () => {
    const contextParams = {
        network,
        web3Providers: provider,
        signer: new Wallet(privateKey),
        // Optional, but without it the client will not be able to resolve IPFS content
        ipfsNodes: [
            {
                url: "https://testing-ipfs-0.aragon.network/api/v0",
                headers: {"X-API-KEY": "b477RhECf8s8sdM7XrkLBs2wHc4kCMwpbcFC55Kt"},
            },
        ],
        // Optional. By default, it will use Aragon's provided endpoints.
        // They will switch depending on the network (production, development)
        // graphqlNodes: [
        //     {
        //         url: "https://subgraph.satsuma-prod.com/aragon/core-goerli/api",
        //     },
        // ],
    };

    const daoContext = new Context(contextParams);
    const daoSDKClient = new Client(daoContext);
    return { daoContext, daoSDKClient };
}

module.exports = {
    initDaoContext
}
