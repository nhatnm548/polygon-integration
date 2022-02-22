import { ethers } from 'ethers';
import config from '../configurations/config';
import { JsonRpcProvider } from '@ethersproject/providers';

export class EthersProvider {
  private static polygonProviderInstance = new ethers.providers.JsonRpcProvider(
    config.network.testnet.httpProvider,
    config.network.testnet.chainId
  );

  static get polygonRpcProvider(): JsonRpcProvider {
    return this.polygonProviderInstance;
  }

  static async isTransactionConfirmed(
    txHash: string,
    provider = this.polygonProviderInstance
  ): Promise<boolean> {
    const tx = await provider.getTransaction(txHash);

    return tx.confirmations > 15;
  }
}
