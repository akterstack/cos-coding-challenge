import { AuthCredential } from './../../Auth/interface/IAuthService';
import { Auction } from '../../../models/Auction';
import { CarOnSaleClientResponse } from '../../../models/CarOnSaleClientResponse';
/**
 * This service describes an interface to access auction data from the CarOnSale API.
 */
export interface ICarOnSaleClient {
  getRunningAuctions(): Promise<Auction[]>;

  getAllAuctions(): Promise<Auction[]>;

  fetchAuction(
    authCred: AuthCredential,
    offset: number,
    limit: number
  ): Promise<CarOnSaleClientResponse>;
}
