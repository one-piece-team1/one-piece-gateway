import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GatewayModule } from './gateways/gateway.module';
import { RateMiddleware } from './middlewares/rate-limit';
import { AuthMiddleware } from './middlewares/auth.service';
import { ChatSocketGateway } from './sockets/chat.gateway';
import { ChatSocketService } from './sockets/chat.service';
import { ChatConsumerService } from './consumers/chat.consumer';
import { ChatEventProudcerService } from './producers/chatevent.producer';
import { ChatMessageRoutingService } from './handlers/chat.handler';
import { ChatEventRoutingService } from './handlers/chat-event.handler';
import { ChatEventAggregate } from './aggregates/chat-event.aggregate';

@Module({
  imports: [GatewayModule],
  providers: [ChatSocketGateway, ChatSocketService, ChatConsumerService, ChatMessageRoutingService, ChatEventRoutingService, ChatEventProudcerService, ChatEventAggregate],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer.apply(AuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
