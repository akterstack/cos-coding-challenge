import chai from 'chai'
import chaiAsPromised from 'chai-as-promised';
import nock from 'nock';
import { IAuthService } from '../interface/IAuthService';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';
import { container } from '../../../main'

chai.use(chaiAsPromised);

const {expect} = chai;

describe('AuthService', () => {
  const authService = container.get<IAuthService>(DependencyIdentifier.AUTH_SERVICE);

  describe('#authenticate()', () => {
    it('should throw error if env.API_BASE_URL is missing.', async () => {
      expect(authService.authenticate('user', 'pass')).to.eventually.throw('Environment variable missing: API_BASE_URL')
    })
    it('should throw error if username is empty.', async () => {
      expect(authService.authenticate('', 'pass')).to.eventually.throw('Username must be provided for authentication.')
    })
    it('should throw error if password is empty.', async () => {
      expect(authService.authenticate('user', '')).to.eventually.throw('Password must be provided for authentication.')
    })

    const username = 'mock_user';
    const password = 'mock_pass';
    const authCreds = {
      userid: 'mock_userid',
      token: 'mock_token'
    }

    before(() => {
      process.env.API_BASE_URL = 'http://api-core-dev.caronsale.de/api'
      nock(process.env.API_BASE_URL)
        .persist()
        .put(`/v1/authentication/${username}`, { password })
        .reply(200, authCreds);
    })

    it('should return token and userid', async () => {
        const authCreds = await authService.authenticate(username, password);
        expect(authCreds).to.have.property('userid')
        expect(authCreds).to.have.property('token')
    })

    after(() => {
      nock.cleanAll()
     })
  })
})
