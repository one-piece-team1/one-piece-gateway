import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import Kafka from 'node-rdkafka';
import { ChatEventProudcerService } from '../producers/chatevent.producer';
import { ChatEventAggregate } from '../aggregates/chat-event.aggregate';
import * as IAuth from '../auth/interfaces';
import * as EChatEvt from '../aggregates/enums';
import * as IChatEvt from '../aggregates/interfaces';
import { config } from '../../config';

@Injectable()
export class ChatEventRoutingService {
  private readonly ChatEventTopic = config.EVENT_STORE_SETTINGS.topics.chatEventTopic;

  constructor(private readonly chatEventProudcerService: ChatEventProudcerService, private readonly chatEventAggregate: ChatEventAggregate) {}

  /**
   * @description Register socket event
   * @public
   * @param {string} socketMessage
   * @returns {void}
   */
  public register(socketMessage: string, payload: IAuth.JwtPayload): void {
    if (!socketMessage) throw new InternalServerErrorException('Non socket message is being proecssed');
    const event: IChatEvt.IEventAggregateResponse<EChatEvt.EChatEeventFromSocket, IChatEvt.IUpdateChatStatusEvt> = JSON.parse(socketMessage);
    event.data.user = payload;
    return this.handler(event);
  }

  /**
   * @description Handle message delivery
   * @private
   * @param {IChatEvt.IEventAggregateResponse<EChatEvt.EChatEeventFromSocket, IChatEvt.IUpdateChatStatusEvt>} event
   * @returns {void}
   */
  private handler(event: IChatEvt.IEventAggregateResponse<EChatEvt.EChatEeventFromSocket, IChatEvt.IUpdateChatStatusEvt>) {
    switch (event.type) {
      case EChatEvt.EChatEeventFromSocket.UPDATEREADSTATUS:
        const readEvt = this.chatEventAggregate.updateReadStatusEvent(event.data);
        return this.chatEventProudcerService.produce<IChatEvt.IEventAggregateResponse<EChatEvt.EChatEeventFromSocket.UPDATEREADSTATUS, IChatEvt.IUpdateChatStatusEvt>>(this.ChatEventTopic, readEvt, readEvt.id);
      case EChatEvt.EChatEeventFromSocket.UPDATESENDSTATUS:
        const sendEvt = this.chatEventAggregate.updateSendStatusEvent(event.data);
        return this.chatEventProudcerService.produce<IChatEvt.IEventAggregateResponse<EChatEvt.EChatEeventFromSocket.UPDATESENDSTATUS, IChatEvt.IUpdateChatStatusEvt>>(this.ChatEventTopic, sendEvt, sendEvt.id);
    }
  }
}
