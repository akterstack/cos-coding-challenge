import { AuthCredential } from './../../Auth/interface/IAuthService';
import { CarOnSaleClientResponse } from '../../../models/CarOnSaleClientResponse';
/**
 * This service describes an interface to access auction data from the CarOnSale API.
 */
export interface ICarOnSaleClient {
  fetchAuctions(
    authCred: AuthCredential,
    offset: number,
    limit?: number
  ): Promise<CarOnSaleClientResponse>;
}
