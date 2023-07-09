import { Auction } from '../../../models/Auction';

export interface IAuctionsInsightService {
  getNumOfAuctions(auctions: Auction[]): number;

  averageNumOfBids(auctions: Auction[]): number;

  averageAuctionProgress(auctions: Auction[]): number;
}
