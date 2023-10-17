const {getDao} = require("./utils/get_dao");


async function main() {
    // Instantiate the general purpose client from the Aragon OSx SDK context.
    await getDao();
}

main();
