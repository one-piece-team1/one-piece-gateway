import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request, Response } from 'express';
import { AddRestEventCMD } from './domains/rest-event/commands/add-rest-event.cmd';
import { APIRequestFactory } from '../libs/request-factory';
import { GeneralPublishersFactory } from '../publishers';
import { GatewayKafkaProudcerService } from '../producers/restevent.producer';
import { ExceptionHandler } from '../libs/utils';
import * as IGateway from './interfaces';
import { config } from '../../config';

enum APIEvent {
  'USERAPI' = '/users',
}

@Injectable()
export class GatewayService {
  private readonly logger: Logger = new Logger('GatewayService');

  constructor(private readonly comandBus: CommandBus, private readonly gatewayKafkaProudcerService: GatewayKafkaProudcerService, private readonly queryBus: QueryBus) {}

  /**
   * @description Check if it's third party routes
   * @protected
   * @param {Request} req
   * @returns {string}
   */
  protected checkIsThirdPartyRoutes(req: Request): string {
    if (req.params['0'].indexOf('google') >= 0) {
      return config.MS_SETTINGS[0].name;
    } else if (req.params['0'].indexOf('facebook') >= 0) {
      return config.MS_SETTINGS[0].name;
    } else {
      return req.header('service-name');
    }
  }

  /**
   * @description Check if verify is required for open routes use, for example third party login landing page or callback url
   * @protected
   * @param {Request} req
   * @returns {boolean}
   */
  protected isVerifyRequired(req: Request): boolean {
    if (req.params['0'].indexOf('google') >= 0) {
      return false;
    } else if (req.params['0'].indexOf('facebook') >= 0) {
      return false;
    } else {
      return true;
    }
  }

  protected getExchangeToipic(endPoint: string): string | null {
    const USERAPIREGEX = new RegExp(APIEvent.USERAPI);
    if (USERAPIREGEX.test(endPoint)) {
      return config.EVENT_STORE_SETTINGS.topics.userEvent;
    }
    return null;
  }

  /**
   * @description Get Request Routing to desingating server
   * @public
   * @param {Request} req
   * @returns {Promise<HttpException | unknown>}
   */
  public async getRequest(req: Request): Promise<HttpException | unknown> {
    // get current service name
    const serviceName: string | undefined = this.checkIsThirdPartyRoutes(req);
    /**
     * @todo get current token
     */
    const serviceToken: string | undefined = req.header('Authorization');
    if (typeof serviceToken !== 'string' && this.isVerifyRequired(req))
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
    const service: IGateway.IServerConf | undefined = config.MS_SETTINGS.find((setting) => setting.name === serviceName);

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
    const endpoint: string = req.url.replace(`/${config.PREFIX}${config.API_EXPLORER_PATH}`, '');

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
      throw new ExceptionHandler(error);
    }
  }

  /**
   * @description Post Request Routing to desingating server
   * @public
   * @param {Request} req
   * @returns {Promise<HttpException | unknown>}
   */
  public async postRequest(req: Request, res: Response): Promise<HttpException | unknown> {
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
    const service: IGateway.IServerConf | undefined = config.MS_SETTINGS.find((setting) => setting.name === serviceName);

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
    const endpoint: string = req.url.replace(`/${config.PREFIX}${config.API_EXPLORER_PATH}`, '');
    const files = req['files'] ? [req['files']] : [];

    try {
      if (req.query.type === 'async') {
        const topic = this.getExchangeToipic(endpoint);
        const event = await this.comandBus.execute(new AddRestEventCMD(endpoint, [req.headers], [req.query], [req.params], [req.body], files, [req.cookies]));
        this.gatewayKafkaProudcerService.produce(topic, event, event.id);
        return res.sendStatus(HttpStatus.ACCEPTED);
      }
      if (req.headers['content-type'].includes('multipart/form-data')) {
        return await APIRequestFactory.createRequest('standard').makeRequest({
          url: `http://${service.host}:${service.port}${endpoint}`,
          method: 'POST',
          headers: {
            'service-name': service.name,
            Authorization: serviceToken,
          },
          body: {
            ...req.body,
            files: req['files'],
          },
          json: true,
        });
      }
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
      throw new ExceptionHandler(error);
    }
  }

  /**
   * @description Put Request Routing to desingating server
   * @public
   * @param {Request} req
   * @returns {Promise<HttpException | unknown>}
   */
  public async putRequest(req: Request, res: Response): Promise<HttpException | unknown> {
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
    const service: IGateway.IServerConf | undefined = config.MS_SETTINGS.find((setting) => setting.name === serviceName);

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
    const endpoint: string = req.url.replace(`/${config.PREFIX}${config.API_EXPLORER_PATH}`, '');

    try {
      if (req.query.type === 'async') {
        const topic = this.getExchangeToipic(endpoint);
        const event = await this.comandBus.execute(new AddRestEventCMD(endpoint, [req.headers], [req.query], [req.params], [req.body], [], [req.cookies]));
        this.gatewayKafkaProudcerService.produce(topic, event, event.id);
        return res.sendStatus(HttpStatus.ACCEPTED);
      }
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
      throw new ExceptionHandler(error);
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
    const service: IGateway.IServerConf | undefined = config.MS_SETTINGS.find((setting) => setting.name === serviceName);

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
    const endpoint: string = req.url.replace(`/${config.PREFIX}${config.API_EXPLORER_PATH}`, '');

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
      throw new ExceptionHandler(error);
    }
  }
}
