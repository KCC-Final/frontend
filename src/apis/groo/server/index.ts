import { auth } from '@/apis/groo/server/auth';
import { book } from '@/apis/groo/server/book';
import { review } from '@/apis/groo/server/review';
import { user } from '@/apis/groo/server/user';

export const fetchGrooInServer = {
  auth: auth,
  book: book,
  review: review,
  user: user
};
