import { Types } from 'mongoose';

export const ObjectId = Types.ObjectId;

/**
 * 比较两个字符串是否相等
 */
export function stringEquals(a: any, b: any): boolean {
  return a.toString() === b.toString();
}

/**
 * 生成 ObjectId
 */
export function genObjectId(str?: string) {
  return new ObjectId(str);
}
