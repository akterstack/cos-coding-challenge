import { injectable } from 'inversify';
import fetch from 'node-fetch';
import { IAuthService, AuthTokenResult } from './../interface/IAuthService';

@injectable()
export class AuthService implements IAuthService {
  async authenticate(username: string, password: string): Promise<AuthTokenResult> {
    if (!process.env.API_BASE_URL) {
      throw new Error(`Environment variable missing: API_BASE_URL`);
    }

    if (!username || !username.length) {
      throw new Error(`Username must be provided for authentication.`)
    }

    if (!password || !password.length) {
      throw new Error(`Password must be provided for authentication.`)
    }

    const res = await fetch(`${process.env.API_BASE_URL}/v1/authentication/${username}`, {
      method: 'PUT',
      body: JSON.stringify({
        password
      })
    });

    const {userid, token} = (await res.json()) as AuthTokenResult;

    return {userid, token};
  }
}
