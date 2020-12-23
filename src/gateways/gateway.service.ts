import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { config } from '../../config';
import { APIRequestFactory } from '../libs/request-factory';
import * as IGateway from './interfaces';

@Injectable()
export class GatewayService {
  /**
   * @description Get Request Routing to desingating server
   * @public
   * @param {Request} req
   * @returns {Promise<HttpException | unknown>}
   */
  public async getRequest(req: Request): Promise<HttpException | unknown> {
    // get current service name
    const serviceName: string | undefined = req.header('service-name');
    /**
     * @todo get current token
     */
    const serviceToken: string | undefined = req.header('Authorization');
    if (typeof serviceToken !== 'string')
      return new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Method Not Allowed',
        },
        HttpStatus.UNAUTHORIZED,
      );

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
          Authorization: serviceToken,
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

  /**
   * @description Post Request Routing to desingating server
   * @public
   * @param {Request} req
   * @returns {Promise<HttpException | unknown>}
   */
  public async postRequest(req: Request): Promise<HttpException | unknown> {
    // get current service name
    const serviceName: string | undefined = req.header('service-name');
    /**
     * @todo get current token
     */
    // const exceptionRoutes = ["signin", 'signup'];
    const serviceToken: string | undefined = req.header('Authorization');

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
        method: 'POST',
        headers: {
          'service-name': service.name,
          Authorization: serviceToken,
        },
        body: req.body,
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

  /**
   * @description Put Request Routing to desingating server
   * @public
   * @param {Request} req
   * @returns {Promise<HttpException | unknown>}
   */
  public async putRequest(req: Request): Promise<HttpException | unknown> {
    // get current service name
    const serviceName: string | undefined = req.header('service-name');
    /**
     * @todo get current token
     */
    const serviceToken: string | undefined = req.header('Authorization');
    if (typeof serviceToken !== 'string')
      return new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Method Not Allowed',
        },
        HttpStatus.UNAUTHORIZED,
      );

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
        method: 'PUT',
        headers: {
          'service-name': service.name,
          Authorization: serviceToken,
        },
        body: req.body,
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

  /**
   * @description Delete Request Routing to desingating server
   * @public
   * @param {Request} req
   * @returns {Promise<HttpException | unknown>}
   */
  public async delRequest(req: Request): Promise<HttpException | unknown> {
    // get current service name
    const serviceName: string | undefined = req.header('service-name');
    /**
     * @todo get current token
     */
    const serviceToken: string | undefined = req.header('Authorization');
    if (typeof serviceToken !== 'string')
      return new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Method Not Allowed',
        },
        HttpStatus.UNAUTHORIZED,
      );

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
        method: 'DELETE',
        headers: {
          'service-name': service.name,
          Authorization: serviceToken,
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
