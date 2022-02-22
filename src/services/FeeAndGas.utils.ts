import axios from 'axios';
import BigNumber from 'bignumber.js';
import config from '../configurations/config';
import { RecommenedFee } from '../types/RecommendedFee.type';
import { EthersProvider } from './EthersProvider.service';
import { BigNumber as EtherBigNumber } from '@ethersproject/bignumber';

export const getRecommendedFee = (priority: string): Promise<RecommenedFee> => {
  try {
    return getRecommendedFeeFromGasStation(priority);
  } catch (_) {
    return getRecommendedFeeFromEthers();
  }
};

export const estimateGas = async (
  toAddress: string,
  amountInWei: string,
  txData: string
): Promise<EtherBigNumber> => {
  return EthersProvider.polygonRpcProvider.estimateGas({
    to: toAddress,
    value: amountInWei,
    data: txData,
  });
};

const getRecommendedFeeFromGasStation = async (
  priority: string
): Promise<RecommenedFee> => {
  const response = await axios.get(config.network.testnet.gasStationApiUrl);

  const { maxFee, maxPriorityFee } = response?.data?.[priority] || {};

  if (!maxFee || !maxPriorityFee) {
    throw new Error('Cannot get fee data.');
  }

  return {
    maxFeePerGas: fromGWeiToWei(maxFee),
    maxPriorityFeePerGas: fromGWeiToWei(maxPriorityFee),
  };
};

const getRecommendedFeeFromEthers = async (): Promise<RecommenedFee> => {
  const { maxFeePerGas, maxPriorityFeePerGas } =
    await EthersProvider.polygonRpcProvider.getFeeData();

  if (!maxFeePerGas || !maxPriorityFeePerGas) {
    throw new Error('Cannot get fee data.');
  }

  return {
    maxFeePerGas: maxFeePerGas.toString(),
    maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
  };
};

const fromGWeiToWei = (value: any): string => {
  const valueInBN = new BigNumber(new BigNumber(value).toFixed(8, 1));
  const exponent = new BigNumber(10).pow(9);

  return valueInBN.multipliedBy(exponent).toString();
};
