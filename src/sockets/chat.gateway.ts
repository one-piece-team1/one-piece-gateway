import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as Express from 'express';
import WebSocket from 'ws';
import * as url from 'url';
import { AutheSerivce } from '../auth/auth.service';
import { ChatEventRoutingService } from '../handlers/chat-event.handler';
import * as IAuth from '../auth/interfaces';
import { config } from '../../config';

@Injectable()
export class ChatSocketGateway {
  public wss: WebSocket.Server;
  private readonly logger: Logger = new Logger('ChatSocketGateway');

  constructor(private readonly autheSerivce: AutheSerivce, private readonly chatEventRoutingService: ChatEventRoutingService) {
    this.init();
  }

  /**
   * @description Can activate ws connection or not
   * @public
   * @param {Express.Request} req
   * @returns {Promise<IAuth.JwtPayload>}
   */
  private async canActivate(req: Express.Request): Promise<IAuth.JwtPayload> {
    try {
      const qs: url.UrlWithParsedQuery = url.parse(req.url, true);
      const payload: IAuth.JwtPayload = await this.autheSerivce.verify(qs.query.accessToken as string);
      if (!payload) return null;
      return payload;
    } catch (error) {
      this.logger.error(error.message, '', 'CanActivateError');
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Init func
   */
  public init() {
    this.wss = new WebSocket.Server({ port: config.WSPORT, path: '/chats' });
    this.wss.on('connection', async (ws: WebSocket, req: Express.Request) => {
      const payload: IAuth.JwtPayload = await this.canActivate(req);
      if (!payload) {
        ws.close(1008, 'Invalid credits');
      } else {
        ws['uid'] = payload.id;
        ws.on('message', (message: string) => {
          this.logger.log('Messaging is on');
          this.chatEventRoutingService.register(message, payload);
        });
        this.logger.log('Connecting ws success');
      }
    });
  }
}
