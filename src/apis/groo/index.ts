import { comment } from './comment';

import { auth } from '@/apis/groo/auth';
import { follow } from '@/apis/groo/follow';
import { review } from '@/apis/groo/review';
import { user } from '@/apis/groo/user';

export const fetchGroo = {
  auth: auth,
  user: user,
  review: review,
  comment: comment,
  follow: follow
};
