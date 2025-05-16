import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { conflict, notFound } from './exceptions';
import { CategoryDto } from './responseData/categoryDto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  public readonly pageSize = 10;

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: { name: createCategoryDto.name },
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async categories(
    page: number,
  ): Promise<{ categories: CategoryDto[]; total: number }> {
    const skip = (page - 1) * this.pageSize;

    const [categories, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        skip,
        take: this.pageSize,
      }),
      this.prisma.category.count(),
    ]);

    return { categories, total };
  }

  async category(id: number) {
    try {
      return await this.prisma.category.findUnique({
        where: { id },
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async getCategory(id: number) {
    try {
      const cat = await this.prisma.category.findUnique({
        where: { id },
      });
      if (cat == null) throw notFound();
      return cat;
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id: id },
        data: {
          name: updateCategoryDto.name,
        },
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  private handleError(e): any {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2001' || e.code === 'P2015' || e.code === 'P2025')
        return notFound();
      if (e.code === 'P2002') return conflict();
    }
    return e;
  }
}
