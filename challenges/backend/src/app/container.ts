import 'reflect-metadata';
import { Container } from 'inversify';
import { DependencyIdentifier } from './DependencyIdentifiers';
import { AuthService } from './services/Auth/classes/AuthService';
import { IAuthService } from './services/Auth/interface/IAuthService';
import { CarOnSaleClient } from './services/CarOnSaleClient/classes/CarOnSaleClient';
import { ICarOnSaleClient } from './services/CarOnSaleClient/interface/ICarOnSaleClient';
import { Logger } from './services/Logger/classes/Logger';
import { ILogger } from './services/Logger/interface/ILogger';

/*
 * Create the DI container.
 */
const container = new Container({
  defaultScope: 'Singleton',
});

/*
 * Register dependencies in DI environment.
 */
container.bind<ILogger>(DependencyIdentifier.LOGGER).to(Logger);
container.bind<IAuthService>(DependencyIdentifier.AUTH_SERVICE).to(AuthService);
container
  .bind<ICarOnSaleClient>(DependencyIdentifier.COS_CLIENT)
  .to(CarOnSaleClient);

export default container;
