import { inject, injectable } from 'inversify';
import { ILogger } from './services/Logger/interface/ILogger';
import { DependencyIdentifier } from './DependencyIdentifiers';
import { IAuctionService } from './services/AuctionsInsight/interface/IAuctionService';

@injectable()
export class AuctionMonitorApp {
  public constructor(
    @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
    @inject(DependencyIdentifier.AUTH_SERVICE)
    private authService: IAuctionService
  ) {}

  public async start(): Promise<void> {
    this.logger.log(`Auction Monitor started.`);

    this.authService.getRunningAuctions();
  }
}
