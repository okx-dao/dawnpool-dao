const { initDaoContext } = require("./init_dao_context");
const {demand} = require("./config");

const getDao = async () => {
    const { daoContext, daoSDKClient } = initDaoContext();
    const daoAddress = demand("DAO_ADDRESS");
    const daoDetails = await daoSDKClient.methods.getDao(daoAddress);
    console.log(`connected to the DAO ${daoAddress}: `, daoDetails);
    console.log(`using signer: `, await daoContext.signer.getAddress());
    return { daoContext, daoSDKClient, daoDetails };
};

module.exports = {
    getDao
}
