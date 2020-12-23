import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { config } from '../../config';
const redisClient = new Redis(config.REDIS_URL);

interface IRateLimit {
  request_time: Date;
  counter: number;
}

@Injectable()
export class RateMiddleware implements NestMiddleware {
  /**
   * @description Rate Limit Handling
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {void | Response}
   */
  use(req: Request, res: Response, next: NextFunction): void | Response {
    // check if routes is exception or not
    if (this.exceptRoutes(req.baseUrl)) return next();
    // check token
    if (!req.headers.authorization) return res.sendStatus(403);

    const token = req.headers.authorization.replace("Bearer ", "");

    // start redis process
    redisClient.exists(token, (err, reply) => {
      if (err) {
        Logger.log(err.message, 'REDIS-RATE-LIMIT-ERR', true);
        process.exit(0);
      }
      // if redis responding
      if (reply === 1) {
        // get redis data by token
        redisClient.get(token, (err, response) => {
          if (err) {
            Logger.log(err.message, 'REDIS-RATE-LIMIT-ERR', true);
          }
          // data handling
          const data = JSON.parse(response);
          const current_time: string = new Date().toLocaleString('zh-TW', {
            timeZone: 'Asia/Taipei',
          });

          // get current counter
          const request_count_per_minutes = data.filter((item: IRateLimit) => {
            const diff_time = new Date(current_time).getTime() - new Date(item.request_time).getTime();
            if (diff_time >= 60 * 1000) {
              item.request_time = new Date(current_time);
              item.counter = 0;
            }
            return item;
          });

          // data handling to increment threshold
          let threshold = 0;
          request_count_per_minutes.forEach(item => {
            threshold += item.counter;
          });

          // rate exception
          if (threshold >= 100) {
            Logger.log(token, 'REDIS-RATE-LIMIT-ECEED', true);
            return res
              .status(429)
              .json({ status: 'error', message: 'Throttle Limit Exceeded' });
          }

          let is_found = false;

          // incrementation
          data.forEach(element => {
            if (element.request_time) {
              is_found = true;
              element.counter++;
            }
          });

          if (!is_found) {
            data.push({
              request_time: new Date(current_time),
              counter: 1,
            });
          }
          redisClient.set(token, JSON.stringify(data), 'EX', 60);
          next();
        });
      } else {
        const data = [];
        data.push({
          request_time: new Date().toLocaleString('zh-TW', {
            timeZone: 'Asia/Taipei',
          }),
          counter: 1,
        });
        redisClient.set(token, JSON.stringify(data), 'EX', 60);
        next();
      }
    });
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
}
