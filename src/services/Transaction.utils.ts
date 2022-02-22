import {
  FeeMarketEIP1559Transaction,
  FeeMarketEIP1559TxData,
} from '@ethereumjs/tx';
import Common, { Hardfork } from '@ethereumjs/common';
import { EthersProvider } from './EthersProvider.service';
import { estimateGas, getRecommendedFee } from './FeeAndGas.utils';
import config from '../configurations/config';
import BigNumber from 'bignumber.js';

const chainId = config.network.testnet.chainId;

export const buildRawTransaction = async (
  fromAddress: string,
  toAddress: string,
  amountInWei: string,
  txData: string = '',
  nonce: number = 0
) => {
  const chainId = config.network.testnet.chainId;

  const { maxFeePerGas, maxPriorityFeePerGas } = await getRecommendedFee(
    'fast'
  );

  const gasLimit = await estimateGas(toAddress, amountInWei, txData);

  if (!nonce) {
    nonce = await getTransactionCount(fromAddress);
  }

  const common = Common.custom({
    chainId,
    networkId: chainId,
    defaultHardfork: Hardfork.London,
  });

  const eip1559TxData = buildTxData(
    nonce.toString(),
    maxFeePerGas,
    maxPriorityFeePerGas,
    gasLimit.toString(),
    toAddress,
    amountInWei,
    txData
  );

  return FeeMarketEIP1559Transaction.fromTxData(eip1559TxData, { common });
};

export const broadcastTransaction = async (signedTransaction: string) => {
  const { hash } = await EthersProvider.polygonRpcProvider.sendTransaction(
    signedTransaction
  );

  return hash;
};

const buildTxData = (
  nonce: string,
  maxFeePerGas: string,
  maxPriorityFeePerGas: string,
  gasLimit: string,
  toAddress: string,
  amountInWei: string,
  txData: string
): FeeMarketEIP1559TxData => {
  return {
    type: '0x02',
    nonce: `0x${new BigNumber(nonce).toString(16)}`,
    maxFeePerGas: `0x${new BigNumber(maxFeePerGas).toString(16)}`,
    maxPriorityFeePerGas: `0x${new BigNumber(maxPriorityFeePerGas).toString(
      16
    )}`,
    gasLimit: `0x${new BigNumber(gasLimit).toString(16)}`,
    to: toAddress,
    value: `0x${new BigNumber(amountInWei).toString(16)}`,
    data: txData,
    chainId: `0x${new BigNumber(chainId).toString(16)}`,
  };
};

const getTransactionCount = (address: string): Promise<number> => {
  return EthersProvider.polygonRpcProvider.getTransactionCount(address);
};
