import bcrypt from 'bcrypt';
import {User} from './models/user';

const saltRounds = 10;

export async function hashPassword(plaintextPassword: string) {
  return bcrypt.hash(plaintextPassword, saltRounds);
}

export async function checkPassword(user: User, password: string) {
  const match = await bcrypt.compare(password, user.passwordHash);
  return match;
}
