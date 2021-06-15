export interface IServerConf {
  name: string;
  host: string;
  port: number;
}

export interface IErrorStruct {
  statusCode: number;
  message?: any;
  error?: any;
}

interface IEventApiResponseBase {
  id: string;
}

type Status = 'error' | 'success';

export interface IEventApiResponse<T> extends IEventApiResponseBase {
  status: Status;
  statusCode: number;
  message?: T;
}

export interface IRestEventResponseCommand {
  id: string;
  requestId: string;
  type: string;
  response: IEventApiResponse<any>;
}
