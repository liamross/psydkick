import moment from 'moment';
import {Connection, ConnectionOptions, createConnection} from 'typeorm';
import {Chat} from './models/chat';
import {Message} from './models/message';
import {User} from './models/user';

export const connectDatabase = async (): Promise<Connection> => {
  const connectionOptions: ConnectionOptions = {
    type: 'sqlite',
    database: './store.sqlite',
    // host: 'localhost',
    // port: 3306,
    // username: 'username', // TODO: update
    // password: 'password', // TODO: update
    entities: [User, Chat, Message],
    synchronize: true,
    logging: false,
  };
  return await createConnection(connectionOptions);
};

interface Item {
  cursor?: string;
  [key: string]: any;
}

interface PaginateResultsInput<T extends Item> {
  after: string;
  pageSize: number;
  results: T[];
  getCursor?: (item: Item) => string;
}

export const paginateResults = <T extends Item>({
  after: cursor,
  pageSize = 20,
  results,
  getCursor,
}: PaginateResultsInput<T>): T[] => {
  if (pageSize < 1) return [];
  if (!cursor) return results.slice(0, pageSize);

  const cursorIndex = results.findIndex(item => {
    // If an item has a `cursor` on it, use that, otherwise try to generate one.
    const itemCursor = item.cursor
      ? item.cursor
      : getCursor
      ? getCursor(item) // attempt to get cursor
      : null;

    // If there's still not a cursor, return false by default.
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex !== -1
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(cursorIndex + 1, Math.min(results.length, cursorIndex + 1 + pageSize))
    : results.slice(0, pageSize);
};

export const logger = (...args: any[]) => {
  const newArgs = args.map(arg => {
    if (arg !== null && typeof arg === 'object' && 'passwordHash' in arg) {
      return {
        ...arg,
        passwordHash: 'CENSORED',
      };
    }
    return arg;
  });
  const date = moment();
  const formattedDate = `[${date.format('DD/MM/YYYY-HH:mm:ss.SSS')}]`;
  return console.log(formattedDate, ...newArgs);
};

export const isId = (id: any): boolean => {
  return typeof id === 'string' || typeof id === 'number';
};
