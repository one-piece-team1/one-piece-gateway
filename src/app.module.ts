import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import EventStoreDBModule from './databases/event-store-db.module';
import { GatewayModule } from './gateways/gateway.module';
import { RateMiddleware } from './middlewares/rate-limit';
import { AuthMiddleware } from './middlewares/auth.service';
import { AutheSerivce } from './auth/auth.service';
import { ChatSocketGateway } from './sockets/chat.gateway';
import { ChatSocketService } from './sockets/chat.service';
import { ChatConsumerService } from './consumers/chat.consumer';
import { ChatEventProudcerService } from './producers/chatevent.producer';
import { ChatMessageRoutingService } from './handlers/chat.handler';
import { ChatEventRoutingService } from './handlers/chat-event.handler';
import { ChatEventAggregate } from './aggregates/chat-event.aggregate';
import { EventStoreDBProvider } from './databases/event-store-db.provider';
import { GatewayKafkaProudcerService } from './producers/restevent.producer';
import { GatewayKakfaConsumerService } from './consumers/restevent.consumer';
import { config } from './../config';

@Module({
  imports: [
    JwtModule.register({
      secret: config.JWT.SECRET,
      signOptions: {
        algorithm: 'HS256',
        expiresIn: '1h',
        issuer: 'one-piece',
      },
      verifyOptions: {
        algorithms: ['HS256'],
        issuer: 'one-piece',
      },
    }),
    EventStoreDBModule,
    GatewayModule,
  ],
  providers: [AutheSerivce, ChatSocketGateway, ChatSocketService, ChatConsumerService, ChatMessageRoutingService, ChatEventRoutingService, ChatEventProudcerService, ChatEventAggregate, ...EventStoreDBProvider, GatewayKafkaProudcerService, GatewayKakfaConsumerService],
  exports: [...EventStoreDBProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer.apply(AuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
