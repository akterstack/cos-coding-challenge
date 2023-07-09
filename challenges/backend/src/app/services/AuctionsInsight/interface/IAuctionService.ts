import { Auction } from '../../../models/Auction';

export interface IAuctionService {
  findAllAuctions(): Promise<Auction[]>;

  findRunningAuctions(): Promise<Auction[]>;

  getNumOfAuctions(auctions: Auction[]): number;

  averageNumOfBids(auctions: Auction[]): number;

  averageAuctionProgress(auctions: Auction[]): number;
}
