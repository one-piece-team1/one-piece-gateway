import { Injectable, Logger } from '@nestjs/common';
import Kafka from 'node-rdkafka';
import { ChatMessageRoutingService } from '../handlers/chat.handler';
import { config } from '../../config';

@Injectable()
export class ChatConsumerService {
  private readonly logger: Logger = new Logger('ChatConsumerService');
  private readonly consumer = new Kafka.KafkaConsumer(
    {
      'bootstrap.servers': config.EVENT_STORE_SETTINGS.bootstrapServers,
      'group.id': config.EVENT_STORE_SETTINGS.chat.groupId,
      'enable.auto.commit': true,
    },
    {
      'auto.offset.reset': 'earliest',
    },
  );

  constructor(private readonly chatMessageRoutingService: ChatMessageRoutingService) {
    this.init();
  }

  /**
   * @description Init func
   */
  init() {
    this.consumer
      .on('ready', () => {
        this.consumer.subscribe([config.EVENT_STORE_SETTINGS.topics.chatTopic]);
        setInterval(() => {
          this.consumer.consume(config.EVENT_STORE_SETTINGS.poolOptions.max);
        }, 1000);
      })
      .on('data', (data) => {
        this.chatMessageRoutingService.register(data);
        this.consumer.commit();
      })
      .on('event.error', (err) => {
        this.logger.error(err.message, '', 'Event_Error');
      })
      .on('rebalance.error', (err) => {
        this.logger.error(err.message, '', 'Reblanace_Error');
      });

    this.consumer.connect({}, (err, data) => {
      if (err) {
        this.logger.error(err.message, '', 'ConsumerConnectError');
      }
    });
  }
}
