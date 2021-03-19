import { Injectable, Logger } from '@nestjs/common';
import { ChatSocketGateway } from './chat.gateway';
import * as EChatRoom from './enums';
import * as IChatRoom from './interfaces';

@Injectable()
export class ChatSocketService {
  private readonly logger: Logger = new Logger('ChatSocketService');

  constructor(private readonly chatSocketGateway: ChatSocketGateway) {}

  /**
   * @description Verify Identity
   * @public
   * @param {IChatRoom.ISocketWithIdentity} client
   * @param {IChatRoom.IChatRoomEntity} chatRoom
   * @returns {boolean}
   */
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

  /**
   * @description send new chat room
   * @public
   * @param {EChatRoom.EChatRoomSocketEvent} type
   * @param {IChatRoom.IChatRoomEntity} chatRoomEvent
   * @returns {void}
   */
  public sendNewChatRoom(
    type: EChatRoom.EChatRoomSocketEvent,
    chatRoomEvent: IChatRoom.IChatRoomEntity,
  ): void {
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
