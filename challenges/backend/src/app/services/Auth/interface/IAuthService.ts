export type AuthTokenResult = {
  userid: string;
  token:string;
}

export interface IAuthService {
  authenticate(username: string, password: string): Promise<AuthTokenResult>;
}
