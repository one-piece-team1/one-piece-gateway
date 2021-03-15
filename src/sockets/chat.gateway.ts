import { Injectable, Logger } from '@nestjs/common';
import WebSocket from 'ws';
import ChatRoomAggregate from './aggregates/chat-room.aggregate';
import * as IChatRoom from './interfaces';
import { config } from '../../config';

@Injectable()
export class ChatSocketGateway {
  private wss: WebSocket.Server;
  private readonly logger: Logger = new Logger('ChatSocketGateway');
  private readonly chatRoomAggregate = new ChatRoomAggregate();

  constructor() {
    this.init();
  }

  init() {
    this.wss = new WebSocket.Server({ port: config.WSPORT, path: '/chats' });
    this.wss.on('connection', (ws: WebSocket) => {
      ws.on('message', (message: string) => {
        this.logger.log('Messaging is on');
      });
      this.logger.log('Connecting ws success');
    });
  }

  public sendNewChatRoom(chatRoom: IChatRoom.IChatRoomEntity) {
    this.wss.clients.forEach((client: WebSocket) => {
      client.send(
        JSON.stringify(this.chatRoomAggregate.createChatRoom(chatRoom)),
        err => {
          if (err) {
            this.logger.error(err.message, '', 'SendNewChatRoom');
          }
        },
      );
    });
  }
}
