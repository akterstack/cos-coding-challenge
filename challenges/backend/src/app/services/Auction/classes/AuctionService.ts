import { inject, injectable } from 'inversify';
import { IAuctionService } from '../interface/IAuctionService';
import { Auction } from '../../../models/Auction';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';
import { AuctionState } from '../../../models/AuctionState';
import { IAuthService } from '../../Auth/interface/IAuthService';
import { ICarOnSaleClient } from '../../CarOnSaleClient/interface/ICarOnSaleClient';
import { calcAverage } from '../../../helpers/utils';

@injectable()
export class AuctionService implements IAuctionService {
  constructor(
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
    while (hasAuction) {
      const { items, total } = await this.carOnSaleClient.fetchAuctions(
        authCred,
        offset
      );
      auctions.push(...items);
      hasAuction = auctions.length < total;
      offset += total;
    }

    return auctions;
  }

  async findRunningAuctions(): Promise<Auction[]> {
    return (await this.findAllAuctions()).filter((auction) => {
      return auction.state === AuctionState.ACTIVE;
    });
  }

  getAverageNumOfBids(auctions: Auction[]): number {
    return calcAverage(auctions.map((auction) => auction.numBids || 0));
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
