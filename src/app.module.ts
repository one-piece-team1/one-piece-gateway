import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GatewayModule } from './gateways/gateway.module';
import { RateMiddleware } from 'middlewares/rate-limit';
import { ChatSocketGateway } from './sockets/chat.gateway';
import { ChatConsumerService } from './consumers/chat.consumer';

@Module({
  imports: [GatewayModule],
  providers: [ChatSocketGateway, ChatConsumerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
