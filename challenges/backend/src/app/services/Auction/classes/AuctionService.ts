import { inject, injectable } from 'inversify';
import { IAuctionService } from '../interface/IAuctionService';
import { Auction } from '../../../models/Auction';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';
import { AuctionState } from '../../../models/AuctionState';
import { IAuthService } from '../../Auth/interface/IAuthService';
import { ICarOnSaleClient } from '../../CarOnSaleClient/interface/ICarOnSaleClient';
import { calcAverage } from '../../../helpers/utils';
import { ILogger } from '../../Logger/interface/ILogger';

@injectable()
export class AuctionService implements IAuctionService {
  constructor(
    @inject(DependencyIdentifier.LOGGER)
    private logger: ILogger,
    @inject(DependencyIdentifier.AUTH_SERVICE)
    private authService: IAuthService,
    @inject(DependencyIdentifier.COS_CLIENT)
    private carOnSaleClient: ICarOnSaleClient
  ) {}

  async findAllAuctions(): Promise<Auction[]> {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    if (!username || !username.length) {
      throw new Error(`Environment variable missing: USERNAME`);
    }

    if (!password || !password.length) {
      throw new Error(`Environment variable missing: PASSWORD`);
    }
    const authCred = await this.authService.authenticate(username, password);

    const auctions: Auction[] = [];
    let hasAuction = true;
    let offset = 0;
    /**
     * I applied paginated fetching assuming that we could have hundreds of auctions.
     * TODO: Improve auction fetch pagination
     * Now fetching with pagination is sequential. To make it concurrent, apply following steps:
     * - fetch count of all ACTIVE auctions
     * - fetch ACTIVE auctions concurrently using Promise.all([...fetchers()])
     */
    while (hasAuction) {
      const { items, total } = await this.carOnSaleClient.fetchAuctions(
        authCred,
        offset
      );
      auctions.push(...items);

      offset += items.length;
      this.logger.debug(`Items fetched: ${offset}/${total}`);
      hasAuction = offset < total;
    }

    return auctions;
  }

  async findRunningAuctions(): Promise<Auction[]> {
    /**
     * Instead of fetching all auctions and filter them in memory,
     * it would be nice to fetch using IAuctionFilter.states params.
     * Unfortunately I couldn't manage the exact value type from swagger API doc.
     * I found `IAuctionFilter.states: { undefined	boolean }`, which was
     * unreadable to me.
     */
    return (await this.findAllAuctions()).filter((auction) => {
      return auction.state === AuctionState.ACTIVE;
    });
  }

  getAverageNumOfBids(auctions: Auction[]): number {
    return Math.round(
      calcAverage(auctions.map((auction) => auction.numBids || 0))
    );
  }

  /**
   * @param auctions: Auction[]
   * @returns auctions progress in percent
   */
  getAverageAuctionProgress(auctions: Auction[]): number {
    const progresses = auctions.map((auction) => {
      if (!auction.currentHighestBidValue || !auction.minimumRequiredAsk) {
        return 0;
      }
      return auction.currentHighestBidValue / auction.minimumRequiredAsk;
    });

    return Number((calcAverage(progresses) * 100).toFixed(2));
  }
}
