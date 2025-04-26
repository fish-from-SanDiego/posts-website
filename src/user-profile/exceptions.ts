import { ConflictException, NotFoundException } from '@nestjs/common';

export function notFound(): Error {
  return new NotFoundException('User profile operation: Resource not found');
}

export function conflict(): Error {
  return new ConflictException(
    'User profile operation: Resource already exists',
  );
}
