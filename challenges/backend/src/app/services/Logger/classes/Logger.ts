import { ILogger } from '../interface/ILogger';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class Logger implements ILogger {
  public constructor() {}

  public log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }

  public debug(message: string): void {
    if (process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true') {
      console.log(`[DEBUG]: ${message}`);
    }
  }
}
