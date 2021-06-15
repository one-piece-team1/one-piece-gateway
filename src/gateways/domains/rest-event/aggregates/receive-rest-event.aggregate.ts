import { AggregateRoot } from '@nestjs/cqrs';
import { ReceiveRestEventCMD } from '../commands/receive-rest-event.cmd';
import { RestEvent } from '../entites/rest-event.entity';

export class ReceiveRestEventAggregate extends AggregateRoot {
  constructor() {
    super();
  }

  public regsiterEvent(event: RestEvent) {
    this.apply(new ReceiveRestEventCMD(event.id, event.response));
  }
}
