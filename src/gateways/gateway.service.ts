import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { config } from '../../config';
import { APIRequestFactory } from '../libs/request-factory';
import * as IGateway from './interfaces';

@Injectable()
export class GatewayService {
  public async getRequest(req: Request): Promise<HttpException | unknown> {
    // get current service name
    const serviceName: string | undefined = req.header('service-name');
    // get current token

    // check service name
    if (typeof serviceName !== 'string')
      return new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Method Not Allowed',
        },
        HttpStatus.UNAUTHORIZED,
      );

    // get current server
    const service: IGateway.IServerConf | undefined = config.MS_SETTINGS.find(
      setting => setting.name === serviceName,
    );

    // check if service is exist or not
    if (typeof service !== 'object')
      return new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Method Not Allowed',
        },
        HttpStatus.UNAUTHORIZED,
      );

    // replace req.url to endpoint
    const endpoint: string = req.url.replace(
      `/${config.PREFIX}${config.API_EXPLORER_PATH}`,
      '',
    );

    try {
      return await APIRequestFactory.createRequest('standard').makeRequest({
        url: `http://${service.host}:${service.port}${endpoint}`,
        method: 'GET',
        headers: {
          'service-name': service.name,
        },
        json: true,
      });
    } catch (error) {
      return new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
