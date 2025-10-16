import { auth } from '@/apis/groo/server/auth';
import { book } from '@/apis/groo/server/book';
import { user } from '@/apis/groo/server/user';

export const fetchGrooInServer = {
  auth: auth,
  book: book,
  user: user
};
