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

describe('CarOnSaleClient', () => {
  const carOnSaleClient = container.get<ICarOnSaleClient>(
    DependencyIdentifier.COS_CLIENT
  );

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

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
    it('should return auctions successfully.', async () => {
      const total = 5;
      const stubAuctions = generateStubAuctions(total);

      sandbox.stub(carOnSaleClient, 'fetchAuction').returns(
        Promise.resolve({
          total,
          items: stubAuctions,
        })
      );

      await expect(
        carOnSaleClient.getAllAuctions()
      ).to.be.eventually.deep.equal(stubAuctions);
    });

    it('should return auctions recursively for all pages.', async () => {
      const total = 50,
        limit = 10;

      const stubFetchAuction = sandbox.stub(carOnSaleClient, 'fetchAuction');

      // Stubbing pagination with multiple api calls
      [...Array(total / limit).keys()].forEach((idx) => {
        const items = generateStubAuctions(limit);

        stubFetchAuction.onCall(idx).returns(
          Promise.resolve({
            total,
            items,
          })
        );
      });

      const allAuctions = await carOnSaleClient.getAllAuctions();
      expect(allAuctions.length).to.be.equal(total);
    });
  });
});
