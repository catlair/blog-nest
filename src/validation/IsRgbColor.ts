import {
  isString,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

export const IS_RGB_COLOR = 'isRgbColor';

// class-validator 中的 isRgbColor 方法
// 不支持 rgb 有空格
// 不支持 rgba 透明度两位小数

const rgbColor =
  /^rgb\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\)$/;
const rgbaColor =
  /^rgba\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){3}(0?\.\d\d?|1(\.0)?|0(\.0)?)\)$/;
const rgbColorPercent =
  /^rgb\((([0-9]%|[1-9][0-9]%|100%),){2}([0-9]%|[1-9][0-9]%|100%)\)/;
const rgbaColorPercent =
  /^rgba\((([0-9]%|[1-9][0-9]%|100%),){3}(0?\.\d\d?|1(\.0)?|0(\.0)?)\)/;

export function isRgbColor(str: string, includePercentValues?: boolean) {
  if (!includePercentValues) {
    return rgbColor.test(str) || rgbaColor.test(str);
  }

  return (
    rgbColor.test(str) ||
    rgbaColor.test(str) ||
    rgbColorPercent.test(str) ||
    rgbaColorPercent.test(str)
  );
}

export function IsRgbColor(
  includePercentValues = true,
  validationOptions?: ValidationOptions,
) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: IS_RGB_COLOR,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value: string) =>
          isString(value) &&
          isRgbColor(value.replace(/\s+/g, ''), includePercentValues),
      },
    });
  };
}
