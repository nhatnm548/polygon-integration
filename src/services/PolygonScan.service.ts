import axios from 'axios';
import config from '../configurations/config';

const polygonScanClient = axios.create({
  baseURL: config.network.testnet.polygonScanApiUrl,
  params: { apikey: config.polygonScanApiKey },
});

export const getDepositTransactions = async (address: string) => {
  const transactionsList = await polygonScanClient.get('/api', {
    params: {
      module: 'account',
      action: 'txlist',
      address,
      page: 1,
      offset: 100,
      sort: 'desc',
    },
  });

  const depositTxsList: Array<any> = [];

  (transactionsList.data?.result ?? []).forEach((tx: any) => {
    if (
      tx.to.toUpperCase() === address.toUpperCase() &&
      tx.from.toUpperCase() !== address.toUpperCase() &&
      Number(tx.confirmations) > 15
    ) {
      depositTxsList.push({
        hash: tx.hash,
        source: tx.from,
        destination: tx.to,
        value: Number(tx.value),
      });
    }
  });

  return depositTxsList;
};
