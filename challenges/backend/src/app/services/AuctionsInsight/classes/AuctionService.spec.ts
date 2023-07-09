import dotenv from 'dotenv';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';
import container from '../../../container';
import { Auction } from '../../../models/Auction';
import { AuctionState } from '../../../models/AuctionState';
import { ICarOnSaleClient } from '../../CarOnSaleClient/interface/ICarOnSaleClient';
import { IAuctionService } from '../interface/IAuctionService';

dotenv.config();

chai.use(chaiAsPromised);
const { expect } = chai;

const carOnSaleClient = container.get<ICarOnSaleClient>(
  DependencyIdentifier.COS_CLIENT
);
const auctionService = container.get<IAuctionService>(
  DependencyIdentifier.AUCTION_SERVICE
);

const generateStubAuctions = (total: number) => {
  return [...Array(total).keys()].reduce((auctions) => {
    const auction = new Auction();
    auction.label = faker.string.alphanumeric();
    auction.numBids = faker.number.int();
    auction.state = faker.helpers.enumValue(AuctionState);
    auctions.push(auction);
    return auctions;
  }, [] as Auction[]);
};

const stubFetchAuction = (total: number, limit: number) => {
  const stubFetchAuction = sinon.stub(carOnSaleClient, 'fetchAuctions');
  const stubActions: Auction[] = [];
  // Stubbing pagination with multiple api calls
  [...Array(Math.ceil(total / limit)).keys()].forEach((idx) => {
    const items = generateStubAuctions(total < limit ? total : limit);

    stubFetchAuction.onCall(idx).resolves({
      total,
      items,
    });

    stubActions.push(...items);
  });

  return stubActions;
};

describe('AuctionService', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('#getAllAuctions()', () => {
    it('should throw error if env.USERNAME is missing.', async () => {
      const username = process.env.USERNAME;
      process.env.USERNAME = '';
      await expect(
        auctionService.findAllAuctions()
      ).to.be.eventually.rejected.and.has.property(
        'message',
        'Environment variable missing: USERNAME'
      );
      process.env.USERNAME = username;
    });

    it('should throw error if env.PASSWORD is missing.', async () => {
      const password = process.env.PASSWORD;
      process.env.PASSWORD = '';
      await expect(
        auctionService.findAllAuctions()
      ).to.be.eventually.rejected.and.has.property(
        'message',
        'Environment variable missing: PASSWORD'
      );
      process.env.PASSWORD = password;
    });

    it('should return auctions successfully.', async () => {
      const total = 5;
      stubFetchAuction(total, 10);

      await expect(
        auctionService.findAllAuctions()
      ).to.be.eventually.has.property('length', 5);
    });

    it('should return auctions recursively for all pages.', async () => {
      const total = 50,
        limit = 10;
      stubFetchAuction(total, limit);

      await expect(
        auctionService.findAllAuctions()
      ).to.be.eventually.has.property('length', total);
    });
  });

  describe('#getRunningAuctions', () => {
    it('should return only active auctions', async () => {
      const stubAuctions = stubFetchAuction(10, 10);
      const stubRunningAuctions = stubAuctions.filter(
        (a) => a.state === AuctionState.ACTIVE
      );
      await expect(
        auctionService.findRunningAuctions()
      ).to.be.eventually.lengthOf(stubRunningAuctions.length);
    });
  });

  describe('#getNumOfAuctions', () => {});
});