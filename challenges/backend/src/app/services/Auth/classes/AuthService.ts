import { injectable } from 'inversify';
import fetch from 'node-fetch';
import { IAuthService, AuthCredential } from './../interface/IAuthService';

@injectable()
export class AuthService implements IAuthService {
  async authenticate(username: string, password: string): Promise<AuthCredential> {
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password
      })
    });

    const {userId, token} = (await res.json()) as AuthCredential;

    return {userId, token};
  }
}
