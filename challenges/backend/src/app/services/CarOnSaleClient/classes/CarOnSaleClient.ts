import { inject, injectable } from 'inversify';
import fetch from 'node-fetch';
import {
  IAuthService,
  AuthCredential,
} from './../../Auth/interface/IAuthService';
import { DependencyIdentifier } from './../../../DependencyIdentifiers';
import { Auction } from '../../../models/Auction';
import { ICarOnSaleClient } from './../interface/ICarOnSaleClient';
import { CarOnSaleClientResponse } from '../../../models/CarOnSaleClientResponse';
import { plainToInstance } from 'class-transformer';
import { AuctionState } from '../../../models/AuctionState';

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {
  constructor(
    @inject(DependencyIdentifier.AUTH_SERVICE) private authService: IAuthService
  ) {}

  async getRunningAuctions(): Promise<Auction[]> {
    return (await this.getAllAuctions()).filter(
      (auc) => auc.state === AuctionState.ACTIVE
    );
  }

  async getAllAuctions(): Promise<Auction[]> {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    if (!username || !username.length) {
      throw new Error(`Environment variable missing: USERNAME`);
    }

    if (!password || !password.length) {
      throw new Error(`Environment variable missing: PASSWORD`);
    }
    const authCred = await this.authService.authenticate(username, password);

    const auctions: Auction[] = [];
    let hasAuction = true;
    let offset = 0;
    while (hasAuction) {
      const { items, total } = await this.fetchAuction(authCred, offset);
      console.log(items);
      auctions.push(...items);

      hasAuction = auctions.length < total;
      offset += total;
    }

    return auctions;
  }

  async fetchAuction(authCred: AuthCredential, offset = 0, limit = 10) {
    const path = `/v2/auction/buyer/?filter=${encodeURIComponent(
      JSON.stringify({ offset, limit })
    )}`;
    const res = await fetch(`${process.env.API_BASE_URL}${path}`, {
      headers: {
        userid: authCred.userId,
        authtoken: authCred.token,
      },
    });

    return plainToInstance(CarOnSaleClientResponse, await res.json(), {
      strategy: 'excludeAll',
    });
  }
}
