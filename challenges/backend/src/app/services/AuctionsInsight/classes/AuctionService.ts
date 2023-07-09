import { inject, injectable } from 'inversify';
import { IAuctionService } from '../interface/IAuctionService';
import { Auction } from '../../../models/Auction';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';
import { AuctionState } from '../../../models/AuctionState';
import { IAuthService } from '../../Auth/interface/IAuthService';
import { ICarOnSaleClient } from '../../CarOnSaleClient/interface/ICarOnSaleClient';

@injectable()
export class AuctionService implements IAuctionService {
  constructor(
    @inject(DependencyIdentifier.AUTH_SERVICE)
    private authService: IAuthService,
    @inject(DependencyIdentifier.COS_CLIENT)
    private carOnSaleClient: ICarOnSaleClient
  ) {}

  async getAllAuctions(): Promise<Auction[]> {
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

  async getRunningAuctions(): Promise<Auction[]> {
    return (await this.getAllAuctions()).filter(
      (auc) => auc.state === AuctionState.ACTIVE
    );
  }

  getNumOfAuctions(auctions: Auction[]) {
    return auctions.length;
  }

  averageNumOfBids(): number {
    throw new Error('Method not implemented.');
  }

  averageAuctionProgress(): number {
    throw new Error('Method not implemented.');
  }
}
