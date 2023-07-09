import { inject, injectable } from 'inversify';
import { ILogger } from './services/Logger/interface/ILogger';
import { DependencyIdentifier } from './DependencyIdentifiers';
import { IAuctionService } from './services/Auction/interface/IAuctionService';

@injectable()
export class AuctionMonitorApp {
  public constructor(
    @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
    @inject(DependencyIdentifier.AUCTION_SERVICE)
    private authService: IAuctionService
  ) {}

  public async start(): Promise<void> {
    this.logger.log(`Auction Monitor started.`);

    try {
      const runningAuctions = await this.authService.findRunningAuctions();
      this.logger.log(`Total running auctions: ${runningAuctions.length}`);
      this.logger.log(
        `Average number of bids: ${this.authService.getAverageNumOfBids(
          runningAuctions
        )}`
      );
      this.logger.log(
        `Average percentage of progress: ${this.authService.getAverageAuctionProgress(
          runningAuctions
        )}`
      );
      process.exit(0);
    } catch (e) {
      this.logger.log(`Error in auction monitoring.`);
      console.log(e);
      process.exit(-1);
    }
  }
}
