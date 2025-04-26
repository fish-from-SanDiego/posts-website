import { ConflictException, NotFoundException } from '@nestjs/common';

export function notFound(): Error {
  return new NotFoundException('Post operation: Resource not found');
}

export function conflict(): Error {
  return new ConflictException('Post operation: Resource already exists');
}
