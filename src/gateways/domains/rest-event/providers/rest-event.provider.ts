import { Provider } from '@nestjs/common';
import { Connection } from 'typeorm';
import { RestEvent } from '../entites/rest-event.entity';

export const RestEventStoreProvider: Provider[] = [
  {
    provide: 'RESTEVENT_REPOSITORY',
    useFactory: (conn: Connection) => conn.getRepository(RestEvent),
    inject: ['EVENTSTORE_DB_CONNECTION'],
  },
];
