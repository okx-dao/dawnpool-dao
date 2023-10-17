require('@nomicfoundation/hardhat-toolbox');
require('@nomiclabs/hardhat-ethers');
const { demand } = require("./scripts/utils/config");

/** @type string */
const provider = demand("WEB3_PROVIDER");
const privateKey = demand("PRIVATE_KEY");

module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      blockGasLimit: 12e6,
      allowUnlimitedContractSize: true,
      initialBaseFeePerGas: (1e9).toString(), // 1 GWEI
      accounts: {
        mnemonic: 'that hockey memory flock solid crunch marine very fruit audit diet basic',
        count: 10,
        accountsBalance: '1000000000000000000000'
      }
    },
    goerli: {
      url: provider,
      chainId: 5,
      timeout: 60000 * 10,
      accounts: [privateKey]
    }
  }
};
