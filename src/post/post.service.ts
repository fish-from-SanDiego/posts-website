import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async post(
    where: Prisma.PostWhereUniqueInput,
    include: Prisma.PostInclude,
  ) {
    return this.prisma.post.findUnique({
      where: where,
      include: include,
    });
  }

  async postPreview(postId: number) {
    return this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        title: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  async createPost(data: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        author: {
          connect: { id: data.authorId },
        },
        categories: {
          create: data.categoryIds.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })),
        },
      },
      include: {
        categories: true,
      },
    });
  }

  async updatePost(params: {
    where: Prisma.PostWhereUniqueInput;
    data: UpdatePostDto;
  }) {
    const { data, where } = params;
    return this.prisma.post.update({
      data: {
        title: data.title,
        content: data.content,
      },
      where: where,
    });
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where,
    });
  }
}
