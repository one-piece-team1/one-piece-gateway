/*eslint no-useless-escape: "off"*/
import { execSync } from 'child_process';
import dotenv from 'dotenv';

/**
 * @description Get Package Version
 * @private
 * @returns {string}
 */
const packageVersionGetter = (): string => {
  const version_buffer = execSync(
    `echo $(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')`,
  );
  return version_buffer ? version_buffer.toString() : '1.0.1';
};

/**
 * @description Get Package Name
 * @private
 * @returns {string}
 */
const packageNameGetter = (): string => {
  const name_buffer = execSync(
    `echo $(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')`,
  );
  return name_buffer ? name_buffer.toString() : 'one-piece-gateway';
};

/**
 * @description Get Package Description
 * @private
 * @returns {string}
 */
const packageDescriptionGetter = (): string => {
  const description_buffer = execSync(
    `echo $(cat package.json | grep description | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')`,
  );
  return description_buffer
    ? description_buffer.toString()
    : 'service evaluate open api';
};

/**
 * @description Cors white lists
 * @private
 * @param {string} env
 * @returns {boolean | string[]}
 */
const corsWhiteLists = (env: string): boolean | string[] => {
  if (env === 'production' || env === 'stage') return [process.env.WEBDOMAIN, process.env.IOSDOMAIN, process.env.ANDRIODDOMAIN];
  return true;
}

// load config
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const configs = {
  base: {
    ENV: env,
    DEV: env === 'development',
    // Pkg Base
    NAME: packageNameGetter(),
    DESCRIPTION: packageDescriptionGetter(),
    // API
    PREFIX: process.env.APPAPIPREFIX || 'v1',
    VERSION: packageVersionGetter(),
    API_EXPLORER_PATH: process.env.APPAPIEXPLORERPATH || '/api',
    // Server Setting
    HOST: process.env.APPHOST || 'localhost',
    PORT: process.env.APPPORT || 8080,
    WSPORT: process.env.WSPORT || 84,
    CORSORIGIN: corsWhiteLists(env),

    JWT: {
      KEY: process.env.JWTKEY || 'lib',
      SECRET: process.env.JWTSECRET || 'lib',
    },

    EVENT_STORE_SETTINGS: {
      protocol: process.env.EVENTSTOREPROTOCOL || 'http',
      hostname: process.env.EVENTSTOREHOSTNAME || '0.0.0.0',
      tcpPort: process.env.EVENTSTORETCPPORT || 1113,
      httpPort: process.env.EVENTSTOREHTTPPORT || 2113,
      credentials: {
        username: process.env.EVENTSTORECREDENTIALSUSERNAME || 'lib-test',
        password: process.env.EVENTSTORECREDENTIALSPASSWORD || '12345678',
      },
      poolOptions: {
        min: process.env.EVENTSTOREPOOLOPTIONSMIN || 1,
        max: process.env.EVENTSTOREPOOLOPTIONSMAX || 100,
      },
      bootstrapServers: process.env.KAFKA_BOOTSTRAP_SERVERS || 'localhost:9094',
      secureProtocol: process.env.KAFKA_SECURITY_PROTOCOL || 'SASL_SSL',
      saslMechanisms: process.env.KAFKA_SASL_MECHANISMS || 'PLAIN',
      chat: {
        groupId: process.env.KAFKA_CHAT_CONSUMER_GROUP || 'onepiece-topic-chat-groups',
      },
      topics: {
        chatTopic: process.env.KAFKA_CHAT_TOPIC || 'onepiece-topic-chat',
        chatEventTopic: process.env.KAFKA_CHAT_EVENT_TOPIC || 'onepiece-topic-chat-event',
      }
    },

    MS_SETTINGS: [
      {
        name: process.env.USERSERVER || 'one-piece-user',
        host: process.env.USERSERVERHOST || '127.0.0.1',
        port: process.env.USERSERVERPORT || 7071,
      },
      {
        name: process.env.TRIPSERVER || 'one-piece-trip',
        host: process.env.TRIPSERVERHOST || '127.0.0.1',
        port: process.env.TRIPSERVERPORT || 7072
      },
      {
        name: process.env.ARTICLESERVER || 'one-piece-article',
        host: process.env.ARTICLESERVERHOST || '127.0.0.1',
        port: process.env.ARTICLESERVERPORT || 7073
      },
      {
        name: process.env.LOCATIONSERVER || 'one-piece-location',
        host: process.env.LOCATIONSERVERHOST || '127.0.0.1',
        port: process.env.LOCATIONSERVERPORT || 7074
      },
      {
        name: process.env.CHATSERVER || 'one-piece-chat',
        host: process.env.CHATSERVERHOST || '127.0.0.1',
        port: process.env.CHATSERVERPORT || 7075
      }
    ],

    MS_EXCEPT: [
      "signin",
      "signup",
      "google",
      "facebook",
      "apple",
      "/forgets/generates",
      '/forgets/verifies',
      '/forgets/confirms'
    ],

    REDIS_URL: process.env.REDISRATELIMITURL || "redis://127.0.0.1:6379",

    GEO_CONFIGS: {
      key: process.env.GEOKEY,
      secret: process.env.GEOSECRET
    }
  },
  development: {},
  production: {
    PORT: process.env.APPPORT || 8080,
  },
  test: {
    PORT: 8080,
  },
};

const config = { ...configs.base, ...configs[env] };

export { config };
