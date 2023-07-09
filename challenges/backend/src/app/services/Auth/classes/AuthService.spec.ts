import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import nock from 'nock';
import { IAuthService } from '../interface/IAuthService';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';
import container from '../../../container';

chai.use(chaiAsPromised);

const { expect } = chai;

describe('AuthService', () => {
  const authService = container.get<IAuthService>(
    DependencyIdentifier.AUTH_SERVICE
  );

  describe('#authenticate()', () => {
    it('should throw error if env.API_BASE_URL is missing.', async () => {
      const baseUrl = process.env.API_BASE_URL;
      process.env.API_BASE_URL = '';
      await expect(
        authService.authenticate('user', 'pass')
      ).to.be.eventually.rejected.and.has.property(
        'message',
        'Environment variable missing: API_BASE_URL'
      );
      process.env.API_BASE_URL = baseUrl;
    });

    it('should throw error if username is empty.', async () => {
      await expect(
        authService.authenticate('', 'pass')
      ).to.be.eventually.rejected.and.has.property(
        'message',
        'Username must be provided for authentication.'
      );
    });

    it('should throw error if password is empty.', async () => {
      await expect(
        authService.authenticate('user', '')
      ).to.be.eventually.rejected.and.has.property(
        'message',
        'Password must be provided for authentication.'
      );
    });

    const username = 'mock_user';
    const password = 'mock_pass';
    const authCred = {
      userid: 'mock_userid',
      token: 'mock_token',
    };

    before(() => {
      process.env.API_BASE_URL = 'http://api-core-dev.caronsale.de/api';
      nock(process.env.API_BASE_URL)
        .persist()
        .put(`/v1/authentication/${username}`, { password })
        .reply(200, authCred);
    });

    it('should return token and userid', async () => {
      const authCred = await authService.authenticate(username, password);
      expect(authCred).to.have.property('userId');
      expect(authCred).to.have.property('token');
    });

    after(() => {
      nock.cleanAll();
    });
  });
});
