import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { AddRestEventCMD } from '../add-rest-event.cmd';
import RestEventStoreRepository from '../../stores/rest-event.store';
import { RestEvent } from '../../entites/rest-event.entity';
import { ReceiveRestEventAggregate } from '../../aggregates/receive-rest-event.aggregate';

@CommandHandler(AddRestEventCMD)
export class ReceiveRestEventHandler implements ICommandHandler<AddRestEventCMD> {
  private readonly logger: Logger = new Logger('ReceiveRestEventHandler');

  public constructor(private readonly restEventStoreRepository: RestEventStoreRepository, private readonly eventPublisher: EventPublisher) {}

  public async execute(cmd: AddRestEventCMD): Promise<RestEvent> {
    this.logger.log(JSON.stringify(cmd), 'Execute-Content');
    const event = new RestEvent();
    Object.assign(event, cmd);
    try {
      const receiveEvent = await this.restEventStoreRepository.register(event);
      if (receiveEvent instanceof Error) {
        throw receiveEvent;
      }
      const receiveEvtAgg = await this.eventPublisher.mergeObjectContext(await new ReceiveRestEventAggregate());
      receiveEvtAgg.regsiterEvent(receiveEvent);
      receiveEvtAgg.commit();
      return receiveEvent;
    } catch (error) {
      this.logger.error(error.message, '', 'Execute');
      throw new Error(error);
    }
  }
}
