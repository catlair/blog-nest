import { registerDecorator, ValidationOptions } from 'class-validator';
import * as mongoose from 'mongoose';
import { isEmpty } from 'lodash';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (isEmpty(value)) {
            return true;
          }
          return mongoose.Types.ObjectId.isValid(value);
        },
      },
    });
  };
}
