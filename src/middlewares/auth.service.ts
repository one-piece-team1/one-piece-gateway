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

  public async use(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    if (this.exceptRoutes(req.baseUrl)) return next();

    if (!req.headers.authorization) return res.sendStatus(403);

    try {
      const response = await this.requestUesr(req.headers.authorization);
      if (response.statusCode !== 200) return res.sendStatus(403);
      next();
    } catch (error) {
      this.logger.log(error.message);
      return res.sendStatus(403);
    }
  }

  protected exceptRoutes(routes: string): boolean {
    for (let i = 0; i < config.MS_EXCEPT.length; i++) {
      if (routes.indexOf(config.MS_EXCEPT[i]) >= 0) return true;
    }
    return false;
  }

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
