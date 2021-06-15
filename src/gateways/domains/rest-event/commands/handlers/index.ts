import { AddRestEventHandler } from './add-rest-event.handler';
import { ReceiveRestEventHandler } from './receive-rest-event.handler';

export const RestEventStoreHandlers = [AddRestEventHandler, ReceiveRestEventHandler];
