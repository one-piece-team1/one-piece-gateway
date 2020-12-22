import {
  Controller,
  Request,
  Get,
  UsePipes,
  ValidationPipe,
  HttpException,
  Post,
  Put,
  Delete,
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

  @Post()
  @UsePipes(ValidationPipe)
  postRequest(
    @Request() req: Express.Request,
  ): Promise<HttpException | unknown> {
    return this.gatewayService.postRequest(req);
  }

  @Put()
  @UsePipes(ValidationPipe)
  putRequest(
    @Request() req: Express.Request,
  ): Promise<HttpException | unknown> {
    return this.gatewayService.putRequest(req);
  }

  @Delete()
  @UsePipes(ValidationPipe)
  delRequest(
    @Request() req: Express.Request,
  ): Promise<HttpException | unknown> {
    return this.gatewayService.delRequest(req);
  }
}
