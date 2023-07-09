import { injectable } from 'inversify';
import fetch from 'node-fetch';
import { plainToInstance } from 'class-transformer';
import { AuthCredential } from './../../Auth/interface/IAuthService';
import { ICarOnSaleClient } from './../interface/ICarOnSaleClient';
import { CarOnSaleClientResponse } from '../../../models/CarOnSaleClientResponse';

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {
  async fetchAuctions(authCred: AuthCredential, offset = 0, limit = 10) {
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
