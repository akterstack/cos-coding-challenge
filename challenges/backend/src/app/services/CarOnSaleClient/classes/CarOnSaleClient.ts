import { ICarOnSaleClient } from './../interface/ICarOnSaleClient';

export class CarOnSaleClient implements ICarOnSaleClient {
  getRunningAuctions(): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
