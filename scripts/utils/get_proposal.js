const { TokenVotingClient } = require("@aragon/sdk-client");
const {getDao} = require("./get_dao");

async function getProposal(proposalId) {
    const { daoContext } = await getDao();
    // Create a TokenVoting client.
    const tokenVotingClient = new TokenVotingClient(
        daoContext,
    );

// Get a specific proposal created using the TokenVoting plugin.
    const tokenVotingProposal = await tokenVotingClient
        .methods
        .getProposal(proposalId);
    console.log(tokenVotingProposal);
}

module.exports = {
    getProposal
}
