export type AuthCredential = {
  userId: string;
  token: string;
};

export interface IAuthService {
  authenticate(username: string, password: string): Promise<AuthCredential>;
}
