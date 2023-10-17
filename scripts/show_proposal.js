const {getProposal} = require("./utils/get_proposal");

async function showProposal() {
    const proposalId = "0x66c01be2fe55834bce3bdd1760e6179d30e9e1cd_0x0";
    await getProposal(proposalId);
}

showProposal();
