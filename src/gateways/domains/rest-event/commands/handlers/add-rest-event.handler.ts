import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { AddRestEventCMD } from '../add-rest-event.cmd';
import RestEventStoreRepository from '../../stores/rest-event.store';
import { RestEvent } from '../../entites/rest-event.entity';
import { NewRestEventAggregate } from '../../aggregates/new-rest-event.aggregate';

@CommandHandler(AddRestEventCMD)
export class AddRestEventHandler implements ICommandHandler<AddRestEventCMD> {
  private readonly logger: Logger = new Logger('AddRestEventHandler');

  public constructor(private readonly restEventStoreRepository: RestEventStoreRepository, private readonly eventPublisher: EventPublisher) {}

  public async execute(cmd: AddRestEventCMD): Promise<RestEvent> {
    this.logger.log(JSON.stringify(cmd), 'Execute-Content');
    const event = new RestEvent();
    Object.assign(event, cmd);
    try {
      const newEvent = await this.restEventStoreRepository.register(event);
      if (newEvent instanceof Error) {
        throw newEvent;
      }
      const newRestEvtAgg = await this.eventPublisher.mergeObjectContext(await new NewRestEventAggregate());
      newRestEvtAgg.regsiterEvent(event);
      newRestEvtAgg.commit();
      return newEvent;
    } catch (error) {
      this.logger.error(error.message, '', 'Execute');
      throw new Error(error);
    }
  }
}
