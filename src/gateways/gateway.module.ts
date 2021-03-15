import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register()],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
