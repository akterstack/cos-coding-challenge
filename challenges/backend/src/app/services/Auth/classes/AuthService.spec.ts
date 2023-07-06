import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
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
      expect(authService.authenticate('', 'pass')).to.eventually.throw('Username must be provided for authentication.L')
    })
    it('should throw error if password is empty.', async () => {
      expect(authService.authenticate('user', '')).to.eventually.throw('Password must be provided for authentication.L')
    })
  })
})
