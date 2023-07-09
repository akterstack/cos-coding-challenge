import { Expose, Transform } from 'class-transformer';
import { AuctionState } from './AuctionState';

export class Auction {
  @Expose()
  label: string;

  @Expose()
  @Transform(({ value }) => AuctionState[value])
  state: AuctionState;

  @Expose()
  numBids?: number;

  @Expose()
  currentHighestBidValue?: number;

  @Expose()
  minimumRequiredAsk?: number;
}
