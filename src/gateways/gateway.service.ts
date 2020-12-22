import { Injectable } from '@nestjs/common';

@Injectable()
export class GatewayService {
  public async getRequest(): Promise<string> {
    return "Hello World!";
  }
}
