import { NewRestEventAggregate } from './new-rest-event.aggregate';
import { ReceiveRestEventAggregate } from './receive-rest-event.aggregate';

export const RestEventAggreages = [NewRestEventAggregate, ReceiveRestEventAggregate];
