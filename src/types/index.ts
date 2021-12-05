export type MgReType<T> = T & {
  /** This documents _id. */
  _id?: T;

  /** This documents __v. */
  __v?: any;
};
