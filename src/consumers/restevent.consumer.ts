import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import Kafka from 'node-rdkafka';
import { ReceiveRestEventCMD } from '../gateways/domains/rest-event/commands/receive-rest-event.cmd';
import * as IGateway from '../gateways/interfaces';
import { config } from '../../config';

@Injectable()
export class GatewayKakfaConsumerService {
  private readonly logger: Logger = new Logger('GatewayKakfaConsumerService');
  private readonly consumer = new Kafka.KafkaConsumer(
    {
      'bootstrap.servers': config.EVENT_STORE_SETTINGS.bootstrapServers,
      'group.id': config.EVENT_STORE_SETTINGS.gateway.groupId,
      'enable.auto.commit': true,
    },
    {
      'auto.offset.reset': 'earliest',
    },
  );

  constructor(private readonly commandBus: CommandBus) {
    this.init();
  }

  /**
   * @description Init func
   */
  init() {
    this.consumer
      .on('ready', () => {
        this.consumer.subscribe([config.EVENT_STORE_SETTINGS.topics.gateWayEvent]);
        setInterval(() => {
          this.consumer.consume(config.EVENT_STORE_SETTINGS.poolOptions.max);
        }, 1000);
      })
      .on('data', (data) => {
        this.logger.log(JSON.parse(data.value.toString()), 'Check');
        this.register(data);
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

  private register(kafkaMsg: Kafka.Message) {
    const kafkaEvt = kafkaMsg.value.toString();
    const jsonEvent: IGateway.IRestEventResponseCommand = JSON.parse(kafkaEvt);
    this.commandBus.execute(new ReceiveRestEventCMD(jsonEvent.requestId, [jsonEvent.response]));
  }
}
