const { ExecuteProposalStep, TokenVotingClient } = require("@aragon/sdk-client");
const {getDao} = require("./get_dao");

async function executeProposal(proposalId) {
    const { daoContext } = await getDao();
    // Insantiate a TokenVoting client.
    const tokenVotingClient = new TokenVotingClient(daoContext);
    // Executes the actions of a TokenVoting proposal.
    const steps = tokenVotingClient.methods.executeProposal(proposalId);

    for await (const step of steps) {
        try {
            switch (step.key) {
                case ExecuteProposalStep.EXECUTING:
                    console.log({ txHash: step.txHash });
                    break;
                case ExecuteProposalStep.DONE:
                    console.log(`proposal ${proposalId} executed!`);
                    break;
            }
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = {
    executeProposal
}
