import {
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller('')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  @UsePipes(ValidationPipe)
  getRequest(): Promise<string> {
    return this.gatewayService.getRequest();
  }
}
