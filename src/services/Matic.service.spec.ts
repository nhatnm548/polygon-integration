import 'mocha';
import { expect } from 'chai';
import { MaticService } from './Matic.service';
import BigNumber from 'bignumber.js';
import config from '../configurations/config';

const SENDER_ADDRESS = config?.senderAddress ?? '';
const RECEIVER_ADDRESS = config?.receiverAddress ?? '';
const A_CONFIRMED_TX_HASH =
  '0xd200e544ac30ad13c0a641b8b74df3834899ca0d81d1b3a0a4182ca0c865f66e';

describe('Matic Service', () => {
  describe('requestAddressCreation.', () => {
    let privateKey: string;
    let publicKey: string;
    let address: string;

    before(async () => {
      const response = await MaticService.requestAddressCreation();

      privateKey = response.privateKey;
      publicKey = response.publicKey;
      address = response.address;
    });

    it('privateKey should be an existed string.', () => {
      expect(privateKey).to.not.be.oneOf([null, undefined]);
      expect(privateKey).to.be.string;
    });

    it('publicKey should be an existed string.', () => {
      expect(publicKey).to.not.be.oneOf([null, undefined]);
      expect(publicKey).to.be.string;
    });

    it('address should be an existed address.', () => {
      expect(address).to.not.be.oneOf([null, undefined]);
      expect(address).to.be.string;
      expect(address).to.match(/^0x/i);
    });
  });

  describe('getBalance.', () => {
    let balance: string;

    before(async () => {
      balance = await MaticService.getBalance(SENDER_ADDRESS);

      console.log(`Available token of the sender address: ${balance} wei.`);
    });

    it('balance should be an existed string.', () => {
      expect(balance).to.not.be.oneOf([null, undefined]);
      expect(balance).to.be.string;
    });

    it('balance should be greater or equal to 0.', () => {
      expect(parseFloat(balance)).to.greaterThanOrEqual(0);
    });
  });

  describe('getTransactions.', () => {
    let transactionsList: Array<any> = [];

    before(async () => {
      transactionsList = await MaticService.getTransactions(SENDER_ADDRESS);
    });

    it('should return an array of deposit transactions.', () => {
      expect(transactionsList).to.not.be.oneOf([null, undefined]);
      expect(transactionsList).to.be.an('array');
      expect(transactionsList.length)
        .to.greaterThanOrEqual(0)
        .and.to.lessThanOrEqual(100);
    });
  });

  describe('calculateFeeForTransfer.', () => {
    let maxFee: BigNumber;

    before(async () => {
      maxFee = await MaticService.calculateFeeForTransfer();
    });

    it('maxFee should a valid number.', () => {
      expect(maxFee).to.not.be.oneOf([null, undefined]);
      expect(maxFee.toNumber()).to.greaterThanOrEqual(0);
    });
  });

  describe('transfer.', () => {
    let txHash: string;

    before(async () => {
      // Send 0.01 MATIC
      txHash = await MaticService.transfer(
        SENDER_ADDRESS,
        RECEIVER_ADDRESS,
        '10000000000000000'
      );

      console.log(`Transaction hash: ${txHash}`);
    });

    it('txHash should a valid string.', () => {
      expect(txHash).to.not.be.oneOf([null, undefined]);
      expect(txHash).to.match(/^0x\w*/);
    });
  });

  describe('monitorTransaction.', () => {
    let isTxConfirmed: boolean;

    before(async () => {
      // Send 0.01 MATIC
      isTxConfirmed = await MaticService.monitorTransaction(
        A_CONFIRMED_TX_HASH
      );
    });

    it('tx should be confirmed (since the tx passed in is hard-coded with a confirmed tx hash).', () => {
      expect(isTxConfirmed).to.not.be.oneOf([null, undefined]);
      expect(isTxConfirmed).to.be.eql(true);
    });
  });
});
