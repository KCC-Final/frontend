import { auth } from '@/apis/groo/auth';
import { review } from '@/apis/groo/review';
import { user } from '@/apis/groo/user';

export const fetchGroo = {
  auth: auth,
  user: user,
  review: review
};
