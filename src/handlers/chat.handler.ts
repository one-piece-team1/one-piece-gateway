import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import Kafka from 'node-rdkafka';
import { ChatSocketService } from '../sockets/chat.service';
import * as EChatRoom from '../sockets/enums';
import * as IChatRoom from '../sockets/interfaces';

@Injectable()
export class ChatMessageRoutingService {
  private readonly logger: Logger = new Logger('ChatMessageRoutingService');

  constructor(private readonly chatSocketService: ChatSocketService) {}

  public register(kafkaMessage: Kafka.Message) {
    if (!kafkaMessage)
      throw new InternalServerErrorException('Non message is being proecssed');
    const event: IChatRoom.IAggregateResponse<
      EChatRoom.EChatRoomSocketEvent,
      IChatRoom.IEventData
    > = JSON.parse(kafkaMessage.value.toString());
    return this.handler(event);
  }

  protected handler(
    event: IChatRoom.IAggregateResponse<
      EChatRoom.EChatRoomSocketEvent,
      IChatRoom.IEventData
    >,
  ) {
    switch (event.type) {
      case EChatRoom.EChatRoomSocketEvent.CREATECHATROOM:
        return this.chatSocketService.sendNewChatRoom(
          event.type,
          event.data as IChatRoom.IChatRoomEntity,
        );
    }
  }
}
