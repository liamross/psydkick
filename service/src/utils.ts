import {Connection, createConnection, ConnectionOptions} from 'typeorm';
import {User} from './models/user';
import {Chat} from './models/chat';
import {Message} from './models/message';

export const connectDatabase = async (): Promise<Connection> => {
  const connectionOptions: ConnectionOptions = {
    type: 'sqlite',
    database: './store.sqlite',
    host: 'localhost',
    port: 3306,
    username: 'username', // TODO: update
    password: 'password', // TODO: update
    entities: [User, Chat, Message],
    synchronize: true,
    logging: false,
  };
  return await createConnection(connectionOptions);
};
