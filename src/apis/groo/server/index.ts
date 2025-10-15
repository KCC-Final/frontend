import { auth } from '@/apis/groo/server/auth';
import { user } from '@/apis/groo/server/user';

export const fetchGrooInServer = {
  auth: auth,
  user: user
};
