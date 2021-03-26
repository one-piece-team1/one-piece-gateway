import * as EChatEvt from '../enums';

export interface IResponseWithPk {
  id: string;
}

export interface IEventAggregateResponse<T, K> extends IResponseWithPk {
  type: T;
  data: K;
}

export interface IUpdateChatStatusEvt {
  type: EChatEvt.EChatSendStatus | EChatEvt.EChatStatus;
  participateId: string;
}
