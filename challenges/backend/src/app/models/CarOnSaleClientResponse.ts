import { Expose, Type } from 'class-transformer';
import { Auction } from './Auction';

export class CarOnSaleClientResponse {
  @Expose()
  @Type(() => Auction)
  items: Auction[];

  @Expose()
  total: number;
}
