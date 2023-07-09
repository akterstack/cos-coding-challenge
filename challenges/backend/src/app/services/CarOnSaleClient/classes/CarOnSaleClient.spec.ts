import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';
import { container } from '../../../main';
import { Auction } from '../../../models/Auction';
import { ICarOnSaleClient } from '../interface/ICarOnSaleClient';
import { AuctionState } from '../../../models/AuctionState';

chai.use(chaiAsPromised);
const { expect } = chai;

let sandbox: sinon.SinonSandbox;

const carOnSaleClient = container.get<ICarOnSaleClient>(
  DependencyIdentifier.COS_CLIENT
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
  const stubFetchAuction = sandbox.stub(carOnSaleClient, 'fetchAuction');

  // Stubbing pagination with multiple api calls
  [...Array(Math.ceil(total / limit)).keys()].forEach((idx) => {
    const items = generateStubAuctions(limit);

    stubFetchAuction.onCall(idx).returns(
      Promise.resolve({
        total,
        items,
      })
    );
  });
};

beforeEach(() => {
  sandbox = sinon.createSandbox();
});

afterEach(() => {
  sandbox.restore();
});
describe('CarOnSaleClient', () => {
  describe('#getAllAuctions()', () => {
    it('should throw error if env.USERNAME is missing.', async () => {
      const username = process.env.USERNAME;
      process.env.USERNAME = '';
      await expect(
        carOnSaleClient.getAllAuctions()
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
        carOnSaleClient.getAllAuctions()
      ).to.be.eventually.rejected.and.has.property(
        'message',
        'Environment variable missing: PASSWORD'
      );
      process.env.PASSWORD = password;
    });

    it('should return auctions successfully.', async () => {
      const total = 5;
      console.log('//');
      stubFetchAuction(total, 10);
      console.log('//');

      console.log('>>>>>>>', await carOnSaleClient.getAllAuctions());

      await expect(
        carOnSaleClient.getAllAuctions()
      ).to.be.eventually.has.property('length', 5);
    });

    it('should return auctions recursively for all pages.', async () => {
      const total = 50,
        limit = 10;
      stubFetchAuction(total, limit);

      await expect(
        carOnSaleClient.getAllAuctions()
      ).to.be.eventually.has.property('length', total);
    });

    describe('#getRunningAuctions', () => {
      it('should return only active auctions', () => {});
    });
  });
});
