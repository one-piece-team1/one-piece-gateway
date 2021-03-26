import { Injectable, Logger } from '@nestjs/common';
import * as Express from 'express';
import WebSocket from 'ws';
import * as url from 'url';
import { ChatEventRoutingService } from '../handlers/chat-event.handler';
import { config } from '../../config';

@Injectable()
export class ChatSocketGateway {
  public wss: WebSocket.Server;
  private readonly logger: Logger = new Logger('ChatSocketGateway');

  constructor(private readonly chatEventRoutingService: ChatEventRoutingService) {
    this.init();
  }

  /**
   * @description Init func
   */
  public init() {
    this.wss = new WebSocket.Server({ port: config.WSPORT, path: '/chats' });
    this.wss.on('connection', (ws: WebSocket, req: Express.Request) => {
      ws.on('message', (message: string) => {
        this.logger.log('Messaging is on');
        this.chatEventRoutingService.register(message);
      });
      this.logger.log('Connecting ws success');
      // later add verification here
      const qs: url.UrlWithParsedQuery = url.parse(req.url, true);
      ws['uid'] = qs.query.userIds;
    });
  }
}
