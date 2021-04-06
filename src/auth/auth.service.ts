import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import * as IAuth from './interfaces';
import { config } from '../../config';

@Injectable()
export class AutheSerivce {
  private readonly logger: Logger = new Logger('AutheSerivce');
  private readonly redisClient = new Redis(config.REDIS_BLACKLIST_URL);
  constructor(private readonly jwtService: JwtService) {}

  /**
   * @description Veify ws connection
   * @public
   * @param {string} token
   * @returns {Promise<IAuth.JwtPayload>}
   */
  public async verify(token: string): Promise<IAuth.JwtPayload> {
    try {
      const payload: IAuth.JwtPayload = this.jwtService.verify(token);
      if (!payload) {
        this.logger.error('Token is invalid', '', 'VerifyError');
        return null;
      }

      // check blacklists
      const blacklists: string[] = await this.redisClient.lrange('blacklist', 0, 99999999);
      if (blacklists.indexOf(token) >= 0) {
        this.logger.error('Token is expired', '', 'VerifyError');
        return null;
      }

      return payload;
    } catch (error) {
      this.logger.error(error.message, '', 'VerifyError');
      return null;
    }
  }
}
