import * as ethers from 'ethers';
import { BigNumber } from 'bignumber.js';
import { getDepositTransactions } from './PolygonScan.service';
import { getRecommendedFee } from './FeeAndGas.utils';
import { EthersProvider } from './EthersProvider.service';
import { broadcastTransaction, buildRawTransaction } from './Transaction.utils';
import { CreatedAddress } from '../types/CreatedAddress.type';
import { Transaction } from '../types/Transaction.type';
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx';
import config from '../configurations/config';

export class MaticService {
  static keyType: string = 'ECDSA';

  static async requestAddressCreation(): Promise<CreatedAddress> {
    let { publicKey, privateKey, address } = await ethers.Wallet.createRandom(
      'ABC XYZ'
    );

    return { privateKey, publicKey, address };
  }

  static async monitorTransaction(txHash: string): Promise<boolean> {
    return EthersProvider.isTransactionConfirmed(txHash);
  }

  static async getBalance(address: string): Promise<string> {
    const balance = await EthersProvider.polygonRpcProvider.getBalance(address);

    return balance.toString();
  }

  static async getTransactions(address: string): Promise<Transaction[]> {
    const balance = await this.getBalance(address);

    if (new BigNumber(balance).lte(0)) {
      return [];
    }

    return getDepositTransactions(address);
  }

  static async calculateFeeForTransfer(): Promise<BigNumber> {
    const MAX_GAS_LIMIT_FOR_ETH_TRANSFER = new BigNumber(21_000);
    const { maxFeePerGas } = await getRecommendedFee('fast');

    return new BigNumber(maxFeePerGas).multipliedBy(
      MAX_GAS_LIMIT_FOR_ETH_TRANSFER
    );
  }

  static async transfer(
    fromAddress: string,
    toAddress: string,
    amountWei: string
  ): Promise<string> {
    const rawTx = await buildRawTransaction(fromAddress, toAddress, amountWei);

    return this.signAndSendUsingPrivKey(rawTx);
  }

  private static async signAndSendUsingPrivKey(
    rawTx: FeeMarketEIP1559Transaction
  ) {
    const signedTx = rawTx.sign(
      Buffer.from(config?.senderPrivKey || '', 'hex')
    );

    const serializedTx = `0x${signedTx.serialize().toString('hex')}`;

    return broadcastTransaction(serializedTx);
  }
}
