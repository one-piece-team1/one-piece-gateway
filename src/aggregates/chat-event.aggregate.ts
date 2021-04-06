import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as EChatEvt from './enums';
import * as IChatEvt from './interfaces';

@Injectable()
export class ChatEventAggregate {
  /**
   * @description Update chat message read status aggreagtes
   * @public
   * @param {IChatEvt.IUpdateChatStatusEvt} data
   * @returns {IChatEvt.IEventAggregateResponse<EChatEvt.EChatEeventFromSocket.UPDATEREADSTATUS, IChatEvt.IUpdateChatStatusEvt>}
   */
  public updateReadStatusEvent(data: IChatEvt.IUpdateChatStatusEvt): IChatEvt.IEventAggregateResponse<EChatEvt.EChatEeventFromSocket.UPDATEREADSTATUS, IChatEvt.IUpdateChatStatusEvt> {
    return Object.freeze<IChatEvt.IEventAggregateResponse<EChatEvt.EChatEeventFromSocket.UPDATEREADSTATUS, IChatEvt.IUpdateChatStatusEvt>>({
      id: uuidv4(),
      type: EChatEvt.EChatEeventFromSocket.UPDATEREADSTATUS,
      data,
    });
  }

  /**
   * @description Update chat message send status aggreagtes
   * @public
   * @param {IChatEvt.IUpdateChatStatusEvt} data
   * @returns {IChatEvt.IEventAggregateResponse<EChatEvt.EChatEeventFromSocket.UPDATESENDSTATUS, IChatEvt.IUpdateChatStatusEvt>}
   */
  public updateSendStatusEvent(data: IChatEvt.IUpdateChatStatusEvt): IChatEvt.IEventAggregateResponse<EChatEvt.EChatEeventFromSocket.UPDATESENDSTATUS, IChatEvt.IUpdateChatStatusEvt> {
    return Object.freeze<IChatEvt.IEventAggregateResponse<EChatEvt.EChatEeventFromSocket.UPDATESENDSTATUS, IChatEvt.IUpdateChatStatusEvt>>({
      id: uuidv4(),
      type: EChatEvt.EChatEeventFromSocket.UPDATESENDSTATUS,
      data,
    });
  }
}
