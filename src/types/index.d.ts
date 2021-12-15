import { Types } from 'mongoose';
import { User } from '@/modules/user/schemas/user.schema';

export type MgReType<T> = T & {
  /** This documents _id. */
  _id?: Types.ObjectId;
};

export type MgReUserType = MgReType<User>;
