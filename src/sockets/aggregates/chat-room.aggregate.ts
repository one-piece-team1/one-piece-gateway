import { Injectable } from '@nestjs/common';
import * as EChatRoom from '../enums';
import * as IChatRoom from '../interfaces';

@Injectable()
export default class ChatRoomAggregate {
  /**
   * @description Create chat room event
   * @public
   * @param {IChatRoom.IChatRoomEntity} chatRoom
   * @returns {IChatRoom.IAggregateResponse<EChatRoom.EChatRoomSocketEvent, IChatRoom.IChatRoomEntity>}
   */
  public createChatRoom(
    chatRoom: IChatRoom.IChatRoomEntity,
  ): IChatRoom.IAggregateResponse<
    EChatRoom.EChatRoomSocketEvent,
    IChatRoom.IChatRoomEntity
  > {
    return Object.freeze<
      IChatRoom.IAggregateResponse<
        EChatRoom.EChatRoomSocketEvent,
        IChatRoom.IChatRoomEntity
      >
    >({
      type: EChatRoom.EChatRoomSocketEvent.CREATECHATROOM,
      data: chatRoom,
    });
  }

  /**
   * @description Update chat room event
   * @public
   * @param {IChatRoom.IChatRoomEntity} chatRoom
   * @returns {IChatRoom.IAggregateResponse<EChatRoom.EChatRoomSocketEvent, IChatRoom.IChatRoomEntity>}
   */
  public updateChatRoom(
    chatRoom: IChatRoom.IChatRoomEntity,
  ): IChatRoom.IAggregateResponse<
    EChatRoom.EChatRoomSocketEvent,
    IChatRoom.IChatRoomEntity
  > {
    return Object.freeze<
      IChatRoom.IAggregateResponse<
        EChatRoom.EChatRoomSocketEvent,
        IChatRoom.IChatRoomEntity
      >
    >({
      type: EChatRoom.EChatRoomSocketEvent.UPDATECHATROOM,
      data: chatRoom,
    });
  }

  /**
   * @description Delete chat room event
   * @public
   * @param {string} chatRoomId
   * @returns {IChatRoom.IAggregateResponse<EChatRoom.EChatRoomSocketEvent, IChatRoom.IResponseWithPk>}
   */
  public deleteChatRoom(
    chatRoomId: string,
  ): IChatRoom.IAggregateResponse<
    EChatRoom.EChatRoomSocketEvent,
    IChatRoom.IResponseWithPk
  > {
    return Object.freeze<
      IChatRoom.IAggregateResponse<
        EChatRoom.EChatRoomSocketEvent,
        IChatRoom.IResponseWithPk
      >
    >({
      type: EChatRoom.EChatRoomSocketEvent.DELETECHATROOM,
      data: {
        id: chatRoomId,
      },
    });
  }
}
