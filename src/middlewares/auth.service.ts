import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { config } from '../../config';
import { APIRequestFactory } from '../libs/request-factory';

@Injectable()
export class AuthService implements NestMiddleware {
  private logger: Logger = new Logger('AuthService');

  /**
   * @description Auth validation Handler
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void | Response>}
   */
  public async use(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    // check if routes is exception or not
    if (this.exceptRoutes(req.baseUrl)) return next();
    // check token
    if (!req.headers.authorization) return res.sendStatus(403);

    try {
      // get user data from user sercice
      const response = await this.requestUesr(req.headers.authorization);
      if (response.statusCode !== 200) return res.sendStatus(403);
      next();
    } catch (error) {
      this.logger.log(error.message);
      return res.sendStatus(403);
    }
  }

  /**
   * @description Handle Exception Routes which don't need to auth verify
   * @param {string} routes
   * @returns {boolean}
   */
  protected exceptRoutes(routes: string): boolean {
    for (let i = 0; i < config.MS_EXCEPT.length; i++) {
      if (routes.indexOf(config.MS_EXCEPT[i]) >= 0) return true;
    }
    return false;
  }

  /**
   * @description Request user info by token to identify if it's validate user
   * @param {string} token
   * @returns {Promise<any>}
   */
  protected async requestUesr(token: string): Promise<any> {
    try {
      const service = config.MS_SETTINGS[0];
      return await APIRequestFactory.createRequest('standard').makeRequest({
        url: `http://${service.host}:${service.port}/users/info`,
        method: 'GET',
        headers: {
          Authorization: token,
        },
        json: true,
      });
    } catch (error) {
      this.logger.log(error.message);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'FORBIDDEN Request',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
