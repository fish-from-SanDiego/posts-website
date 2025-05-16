import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotEmptyTrimmed(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsNotEmptyTrimmed',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && value.trim().length !== 0;
        },
      },
    });
  };
}
