import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RestEvent } from '../entites/rest-event.entity';

@Injectable()
export default class RestEventStoreRepository {
  public constructor(
    @Inject('RESTEVENT_REPOSITORY')
    private restEventRepository: Repository<RestEvent>,
  ) {}

  public async allAllRestEvent(): Promise<RestEvent[]> {
    return await this.restEventRepository.find();
  }

  public async getRestEventById(id: string): Promise<RestEvent> {
    return await this.restEventRepository.findOne(id);
  }

  public async register(data: RestEvent): Promise<RestEvent | Error>;
  public async register(data: RestEvent, id: string): Promise<RestEvent | Error>;
  public async register(data: RestEvent, id?: string): Promise<RestEvent | Error> {
    if (id) {
      return await this.updateEvent(id, data);
    }
    return await this.createEvent(data);
  }

  private async createEvent(restEventEntity: RestEvent): Promise<RestEvent | Error> {
    try {
      const event = this.restEventRepository.create(restEventEntity);
      return await this.restEventRepository.save(event);
    } catch (error) {
      return new Error(error);
    }
  }

  private async updateEvent(id: string, restEventEntity: RestEvent): Promise<RestEvent | Error> {
    try {
      await this.restEventRepository.update({ id }, restEventEntity);
      return this.restEventRepository.findOne(id);
    } catch (error) {
      return new Error(error);
    }
  }
}
