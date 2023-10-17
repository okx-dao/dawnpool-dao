const {voteChangeProxyAdmin} = require("./utils/vote_manage_upgrades");
const {demand} = require("./utils/config");

const DAWNPOOL_TEST_ADDRESS = demand("DAWNPOOL_TEST_ADDRESS");
const NEW_PROXY_ADMIN_ADDRESS = demand("NEW_PROXY_ADMIN_ADDRESS"); //

async function voteToChangeProxyAdmin() {
    const metaData = {
        title: "Change proxy admin",
        summary: "This is change proxy admin proposal",
        description: `Change proxy admin to separately deployed contract: ${NEW_PROXY_ADMIN_ADDRESS}`,
        resources: [
            {
                url: "https://test.com",
                name: "Ray",
            },
        ],
    }
    await voteChangeProxyAdmin(DAWNPOOL_TEST_ADDRESS, NEW_PROXY_ADMIN_ADDRESS, metaData);
}

voteToChangeProxyAdmin()
