import { auth } from '@/apis/groo/auth';
import { book } from '@/apis/groo/book';
import { comment } from '@/apis/groo/comment';
import { dashboard } from '@/apis/groo/dashboard';
import { follow } from '@/apis/groo/follow';
import { review } from '@/apis/groo/review';
import { user } from '@/apis/groo/user';

export const fetchGroo = {
  auth: auth,
  book: book,
  comment: comment,
  dashboard: dashboard,
  follow: follow,
  review: review,
  user: user
};
