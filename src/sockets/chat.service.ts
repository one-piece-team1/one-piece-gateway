import { Injectable, Logger } from '@nestjs/common';
import { ChatSocketGateway } from './chat.gateway';
import * as EChatRoom from './enums';
import * as IChatRoom from './interfaces';

@Injectable()
export class ChatSocketService {
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

  public sendNewChatRoom(
    type: EChatRoom.EChatRoomSocketEvent,
    chatRoomEvent: IChatRoom.IChatRoomEntity,
  ) {
    this.chatSocketGateway.wss.clients.forEach(
      (client: IChatRoom.ISocketWithIdentity) => {
        const isClient = this.isRightClient(client, chatRoomEvent);
        if (isClient) {
          client.send(JSON.stringify({ type, data: chatRoomEvent }), err => {
            if (err) {
              this.logger.error(err.message, '', 'SendNewChatRoom');
            }
          });
        }
      },
    );
  }
}
