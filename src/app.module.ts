import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GatewayModule } from './gateways/gateway.module';
import { RateMiddleware } from 'middlewares/rate-limit';

@Module({
  imports: [GatewayModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
