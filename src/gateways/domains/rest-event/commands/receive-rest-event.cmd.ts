export class ReceiveRestEventCMD {
  public constructor(public id: string, public path: string, public headers: Array<any>, public querys: Array<any>, public params: Array<any>, public body: Array<any>, public files: Array<any>, public cookies: Array<any>) {}
}
