import { Auction } from '../../../models/Auction';

export interface IAuctionService {
  getAllAuctions(): Promise<Auction[]>;

  getRunningAuctions(): Promise<Auction[]>;

  getNumOfAuctions(auctions: Auction[]): number;

  averageNumOfBids(auctions: Auction[]): number;

  averageAuctionProgress(auctions: Auction[]): number;
}
