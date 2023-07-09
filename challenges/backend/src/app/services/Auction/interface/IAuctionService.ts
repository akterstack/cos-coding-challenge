import { Auction } from '../../../models/Auction';

export interface IAuctionService {
  findAllAuctions(): Promise<Auction[]>;

  findRunningAuctions(): Promise<Auction[]>;

  getAverageNumOfBids(auctions: Auction[]): number;

  getAverageAuctionProgress(auctions: Auction[]): number;
}
