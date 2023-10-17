const {initDaoContext} = require("./init_dao_context");
const {TokenVotingClient, VoteValues, ProposalCreationSteps} = require("@aragon/sdk-client");
const {uploadToIPFS} = require("./ipfs-upload");
const {demand} = require("./config");

async function newProposal(actions, metaData) {
    const { daoContext } = initDaoContext();
    // Create a TokenVoting client.
    const tokenVotingClient = new TokenVotingClient(
        daoContext,
    );
    const metadataUri = await uploadToIPFS(metaData);
    console.log(metadataUri);
    const tokenVotingPluginAddr = demand("TOKEN_VOTING_PLUGIN_ADDRESS");
    const proposalParams = {
        pluginAddress: tokenVotingPluginAddr, // the address of the TokenVoting plugin contract containing all plugin logic.
        metadataUri,
        actions, // optional, if none, leave an empty array `[]`
        // startDate: new Date(),
        // endDate: new Date(),
        executeOnPass: true,
        creatorVote: VoteValues.YES, // default NO, other options: ABSTAIN, YES
    };
    // Creates a proposal using the token voting governance mechanism, which executes with the parameters set in the configAction object.
    const steps = tokenVotingClient.methods.createProposal(proposalParams);

    for await (const step of steps) {
        try {
            switch (step.key) {
                case ProposalCreationSteps.CREATING:
                    console.log(step.txHash);
                    break;
                case ProposalCreationSteps.DONE:
                    console.log(step.proposalId);
                    break;
            }
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = {
    newProposal
}
