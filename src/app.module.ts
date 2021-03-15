import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GatewayModule } from './gateways/gateway.module';
import { RateMiddleware } from 'middlewares/rate-limit';
import { ChatSocketGateway } from './sockets/chat.gateway';

@Module({
  imports: [GatewayModule],
  providers: [ChatSocketGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
