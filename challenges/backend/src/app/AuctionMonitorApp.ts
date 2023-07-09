import 'reflect-metadata';
import { ICarOnSaleClient } from './services/CarOnSaleClient/interface/ICarOnSaleClient';
import { inject, injectable } from 'inversify';
import { ILogger } from './services/Logger/interface/ILogger';
import { DependencyIdentifier } from './DependencyIdentifiers';

@injectable()
export class AuctionMonitorApp {
  public constructor(
    @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
    @inject(DependencyIdentifier.COS_CLIENT)
    private carOnSaleClient: ICarOnSaleClient
  ) {}

  public async start(): Promise<void> {
    this.logger.log(`Auction Monitor started.`);

    this.carOnSaleClient.getRunningAuctions();
  }
}
