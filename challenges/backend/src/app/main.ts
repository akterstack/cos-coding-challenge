import 'reflect-metadata';
import dotenv from 'dotenv';
import container from './container';
import { AuctionMonitorApp } from './AuctionMonitorApp';

dotenv.config();
/*
 * Inject all dependencies in the application & retrieve application instance.
 */
const app = container.resolve(AuctionMonitorApp);

/*
 * Start the application
 */
(async () => {
  await app.start();
})();
