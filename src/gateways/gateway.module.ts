import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CqrsModule } from '@nestjs/cqrs';
import EventStoreDBModule from '../databases/event-store-db.module';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { RestEventStoreProvider } from './domains/rest-event/providers/rest-event.provider';
import { RestEventStoreHandlers } from './domains/rest-event/commands/handlers';
import RestEventStoreRepository from './domains/rest-event/stores/rest-event.store';

@Module({
  imports: [MulterModule.register(), CqrsModule, EventStoreDBModule],
  controllers: [GatewayController],
  providers: [...RestEventStoreHandlers, RestEventStoreRepository, ...RestEventStoreProvider, GatewayService],
})
export class GatewayModule {}
