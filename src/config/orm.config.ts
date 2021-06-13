import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { config } from '../../config';

export const eventStoreConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: config.EVENT_STORE_SETTINGS.hostname,
  port: config.EVENT_STORE_SETTINGS.tcpPort,
  username: config.EVENT_STORE_SETTINGS.username,
  password: config.EVENT_STORE_SETTINGS.password,
  database: config.EVENT_STORE_SETTINGS.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + './migration/*.ts'],
  subscribers: [__dirname + '/../**/*.audit.{js,ts}'],
  synchronize: true,
  logging: false,
};

export const testOrmconfig = (entities): PostgresConnectionOptions => ({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123',
  database: 'onepiece-test',
  entities,
  synchronize: true,
  dropSchema: true,
  logging: false,
  name: 'testConnection',
});
