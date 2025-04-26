import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { conflict, notFound } from './exceptions';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  private readonly pageSize = 10;

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: { name: createCategoryDto.name },
    });
  }

  async categories(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take: limit,
      }),
      this.prisma.category.count(),
    ]);

    return { categories, total };
  }

  async category(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
