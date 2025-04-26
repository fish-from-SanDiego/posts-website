import { ConflictException, NotFoundException } from '@nestjs/common';

export function notFound(): Error {
  return new NotFoundException('Comment operation: Resource not found');
}

export function conflict(): Error {
  return new ConflictException('Comment operation: Resource already exists');
}
