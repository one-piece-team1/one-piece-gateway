import {
  Controller,
  Request,
  Get,
  UsePipes,
  ValidationPipe,
  HttpException,
} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import * as Express from 'express';

@Controller('/*')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  @UsePipes(ValidationPipe)
  getRequest(
    @Request() req: Express.Request,
  ): Promise<HttpException | unknown> {
    return this.gatewayService.getRequest(req);
  }
}
