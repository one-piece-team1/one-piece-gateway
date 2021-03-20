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
   * @private
   * @param {IChatRoom.ISocketWithIdentity} client
   * @param {IChatRoom.IChatRoomEntity} chatRoom
   * @returns {boolean}
   */
  private isRightClient(client: IChatRoom.ISocketWithIdentity, chatRoom: IChatRoom.IChatRoomEntity | IChatRoom.IChatEntity): boolean {
    let isClient = false;
    chatRoom.chatParticipate.users.forEach((user) => {
      if (user.id === client.uid) {
        isClient = true;
      }
    });
    return isClient;
  }

  /**
   * @description Send event handler
   * @private
   * @param {IChatRoom.ISocketWithIdentity} client
   * @param {T} type
   * @param {K} data
   * @returns {void}
   */
  private sendEvent<T, K>(client: IChatRoom.ISocketWithIdentity, type: T, data: K): void {
    client.send(JSON.stringify({ type, data }), (err) => {
      if (err) {
        this.logger.error(err.message, '', `${type}SendError`);
      }
    });
  }

  /**
   * @description send new chat room
   * @public
   * @param {EChatRoom.EChatRoomSocketEvent} type
   * @param {IChatRoom.IChatRoomEntity} chatRoomEvent
   * @returns {void}
   */
  public sendNewChatRoom(type: EChatRoom.EChatRoomSocketEvent, chatRoomEvent: IChatRoom.IChatRoomEntity): void {
    this.chatSocketGateway.wss.clients.forEach((client: IChatRoom.ISocketWithIdentity) => {
      const isClient = this.isRightClient(client, chatRoomEvent);
      if (isClient) {
        this.sendEvent<EChatRoom.EChatRoomSocketEvent, IChatRoom.IChatRoomEntity>(client, type, chatRoomEvent);
      }
    });
  }

  /**
   * @description send new chat message
   * @public
   * @param {EChatRoom.EChatRoomSocketEvent} type
   * @param {IChatRoom.IChatRoomEntity} msgEvent
   * @returns {void}
   */
  public sendNewChatMessage(type: EChatRoom.EChatRoomSocketEvent, msgEvent: IChatRoom.IChatEntity): void {
    this.chatSocketGateway.wss.clients.forEach((client: IChatRoom.ISocketWithIdentity) => {
      const isClient = this.isRightClient(client, msgEvent);
      if (isClient) {
        this.sendEvent<EChatRoom.EChatRoomSocketEvent, IChatRoom.IChatEntity>(client, type, msgEvent);
      }
    });
  }
}
