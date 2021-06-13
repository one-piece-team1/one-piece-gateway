import { AggregateRoot } from '@nestjs/cqrs';
import { AddRestEventCMD } from '../commands/add-rest-event.cmd';
import { RestEvent } from '../entites/rest-event.entity';

export class NewRestEventAggregate extends AggregateRoot {
  constructor() {
    super();
  }

  public regsiterEvent(event: RestEvent) {
    this.apply(new AddRestEventCMD(event.path, event.headers, event.querys, event.params, event.body, event.files, event.cookies));
  }
}
