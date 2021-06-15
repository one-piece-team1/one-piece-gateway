import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ReceiveRestEventCMD } from '../receive-rest-event.cmd';
import RestEventStoreRepository from '../../stores/rest-event.store';
import { RestEvent } from '../../entites/rest-event.entity';
import { ReceiveRestEventAggregate } from '../../aggregates/receive-rest-event.aggregate';

@CommandHandler(ReceiveRestEventCMD)
export class ReceiveRestEventHandler implements ICommandHandler<ReceiveRestEventCMD> {
  private readonly logger: Logger = new Logger('ReceiveRestEventHandler');

  public constructor(private readonly restEventStoreRepository: RestEventStoreRepository, private readonly eventPublisher: EventPublisher) {}

  public async execute(cmd: ReceiveRestEventCMD): Promise<RestEvent> {
    this.logger.log(JSON.stringify(cmd), 'Execute-Content');
    Object.assign(cmd, { status: true });
    try {
      const receiveEvent = await this.restEventStoreRepository.register(cmd as RestEvent, cmd.id);
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
