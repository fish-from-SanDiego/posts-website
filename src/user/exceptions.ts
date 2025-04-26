import { ConflictException, NotFoundException } from '@nestjs/common';

export function notFound(): Error {
  return new NotFoundException('User operation: Resource not found');
}

export function conflict(): Error {
  return new ConflictException('User operation: Resource already exists');
}
