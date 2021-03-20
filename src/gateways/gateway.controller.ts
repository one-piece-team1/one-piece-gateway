import { Controller, Request, Get, UsePipes, ValidationPipe, HttpException, Post, Put, Delete, UseInterceptors } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import * as Express from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { isImageFilter } from '../libs/utils';

@Controller('/*')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  @UsePipes(ValidationPipe)
  getRequest(@Request() req: Express.Request): Promise<HttpException | unknown> {
    return this.gatewayService.getRequest(req);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      fileFilter: isImageFilter,
    }),
  )
  postRequest(@Request() req: Express.Request): Promise<HttpException | unknown> {
    return this.gatewayService.postRequest(req);
  }

  @Put()
  @UsePipes(ValidationPipe)
  putRequest(@Request() req: Express.Request): Promise<HttpException | unknown> {
    return this.gatewayService.putRequest(req);
  }

  @Delete()
  @UsePipes(ValidationPipe)
  delRequest(@Request() req: Express.Request): Promise<HttpException | unknown> {
    return this.gatewayService.delRequest(req);
  }
}
