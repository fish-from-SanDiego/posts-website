import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async getLikesCount(where: Prisma.LikeWhereInput) {
    return this.prisma.like.count({ where: where });
  }

  async createLike(data: CreateLikeDto) {
    return this.prisma.like.create({
      data: {
        userId: data.userId,
        postId: data.postId,
      },
    });
  }

  async removeLike(where: Prisma.LikeWhereUniqueInput) {
    return this.prisma.like.delete({
      where: where,
    });
  }
}
