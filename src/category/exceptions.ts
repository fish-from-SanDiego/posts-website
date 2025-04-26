import { ConflictException, NotFoundException } from '@nestjs/common';

export function notFound(): Error {
  return new NotFoundException('Category operation: Resource not found');
}

export function conflict(): Error {
  return new ConflictException('Category operation: Resource already exists');
}
