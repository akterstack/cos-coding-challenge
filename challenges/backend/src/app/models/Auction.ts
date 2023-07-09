import { Expose } from 'class-transformer';
import { AuctionState } from './AuctionState';

export class Auction {
  @Expose()
  label: string;

  @Expose()
  state: AuctionState;

  @Expose()
  numBids?: number;

  @Expose()
  currentHighestBidValue?: number;

  @Expose()
  minimumRequiredAsk?: number;
}
