import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { config } from '../../config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private logger: Logger = new Logger('AuthService');

  /**
   * @description Auth validation Handler
   * @public
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {void | Response}
   */
  public use(req: Request, res: Response, next: NextFunction): void | Response {
    if (!this.originHandling(req)) {
      this.logger.error(`${req.ip} from ${req.hostname} send malware request with wrong origin`, '', 'UserOriginError');
      return res.sendStatus(403);
    }
    // check if routes is exception or not
    if (this.exceptRoutes(req.baseUrl)) return next();
    // check token
    if (!req.headers.authorization) {
      this.logger.error(`${req.ip} from ${req.hostname} send malware request with token`, '', 'TokenError');
      return res.sendStatus(403);
    }
    next();
  }

  /**
   * @description Handle Exception Routes which don't need to auth verify
   * @private
   * @param {string} routes
   * @returns {boolean}
   */
  private exceptRoutes(routes: string): boolean {
    for (let i = 0; i < config.MS_EXCEPT.length; i++) {
      if (routes.indexOf(config.MS_EXCEPT[i]) >= 0) return true;
    }
    return false;
  }

  /**
   * @description Origin header handling due to Nestjs CORs has issued for handling
   * @private
   * @param {Request} req
   * @returns {void}
   */
  private originHandling(req: Request): boolean {
    const whiteLists: boolean | string[] = config.CORSORIGIN;
    if (typeof whiteLists === 'boolean') return true;
    if (!req.headers.origin) return false;
    if (whiteLists.indexOf(req.headers.origin) !== -1) return true;
    return false;
  }
}
