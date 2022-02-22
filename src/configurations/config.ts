import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  network: {
    testnet: {
      httpProvider: "https://rpc-mumbai.matic.today",
      chainId: 80001,
      gasPrice: 20000000000,
      gasStationApiUrl: "https://gasstation-mumbai.matic.today/v2",
      polygonScanApiUrl: "https://api-testnet.polygonscan.com"
    },
    mainnet: {
      httpProvider: "https://rpc.xinfin.network",
      chainId: 137,
      gasPrice: 25000000000,
      blocksscanUrl: "https://xdc.blocksscan.io",
      gasStationApiUrl: "https://gasstation-mainnet.matic.network/v2",
      polygonScanApiUrl: "https://api.polygonscan.com"
    }
  },
  polygonScanApiKey: process.env.POLYGON_SCAN_API_KEY,
  senderAddress: process.env.TEST_SENDER_ADDRESS,
  senderPrivKey: process.env.TEST_SENDER_ADDRESS_PRIV_KEY,
  receiverAddress: process.env.TEST_RECEIVER_ADDRESS
}

export default config;