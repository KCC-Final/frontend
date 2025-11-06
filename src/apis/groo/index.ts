import { auth } from '@/apis/groo/auth';
import { book } from '@/apis/groo/book';
import { bookshelf } from '@/apis/groo/bookshelf';
import { comment } from '@/apis/groo/comment';
import { dashboard } from '@/apis/groo/dashboard';
import { follow } from '@/apis/groo/follow';
import { notification } from '@/apis/groo/notification';
import { review } from '@/apis/groo/review';
import { search } from '@/apis/groo/search';
import { user } from '@/apis/groo/user';

export const fetchGroo = {
  auth: auth,
  book: book,
  comment: comment,
  dashboard: dashboard,
  bookshelf: bookshelf,
  follow: follow,
  review: review,
  search: search,
  user: user,
  notification: notification
};
