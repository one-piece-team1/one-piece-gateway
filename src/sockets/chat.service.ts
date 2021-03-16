import { Injectable, Logger } from '@nestjs/common';
import WebSocket from 'ws';
import { ChatSocketGateway } from './chat.gateway';
import ChatRoomAggregate from './aggregates/chat-room.aggregate';
import * as IChatRoom from './interfaces';

@Injectable()
export class ChatSocketService {
  private readonly chatRoomAggregate = new ChatRoomAggregate();
  private readonly logger: Logger = new Logger('ChatSocketService');

  constructor(private readonly chatSocketGateway: ChatSocketGateway) {}

  protected isRightClient(
    client: IChatRoom.ISocketWithIdentity,
    chatRoom: IChatRoom.IChatRoomEntity,
  ): boolean {
    let isClient = false;
    chatRoom.participateId.userIds.forEach(user => {
      if (user.id === client.uid) {
        isClient = true;
      }
    });
    return isClient;
  }

  public sendNewChatRoom(chatRoom: IChatRoom.IChatRoomEntity) {
    this.chatSocketGateway.wss.clients.forEach(
      (client: IChatRoom.ISocketWithIdentity) => {
        const isClient = this.isRightClient(client, chatRoom);
        if (isClient) {
          client.send(
            JSON.stringify(this.chatRoomAggregate.createChatRoom(chatRoom)),
            err => {
              if (err) {
                this.logger.error(err.message, '', 'SendNewChatRoom');
              }
            },
          );
        }
      },
    );
  }
}
