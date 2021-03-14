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