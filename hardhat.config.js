require('@nomiclabs/hardhat-waffle');
require('solidity-coverage');
require('dotenv').config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_RINKEBY_URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      network: 'JQ3HU9YQR7YT9G7KEKJ9I77BPNWC9NBJBD',
    },
  },
  solidity: '0.8.7',
};
