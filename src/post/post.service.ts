import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { conflict, notFound } from './exceptions';

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
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return this.prisma.post.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async post(where: Prisma.PostWhereUniqueInput) {
    try {
      const include = {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
      };
      return this.prisma.post.findUnique({
        where: where,
        include: include,
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async postPreview(postId: number) {
    try {
      return this.prisma.post.findUnique({
        where: { id: postId },
        select: {
          title: true,
          id: true,
          author: {
            select: {
              username: true,
            },
          },
        },
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async createPost(data: CreatePostDto) {
    try {
      return this.prisma.post.create({
        data: {
          title: data.title,
          content: data.content,
          author: {
            connect: { id: +data.authorId },
          },
          categories: {
            create: data.categoryNames.map((cat) => ({
              category: {
                connectOrCreate: {
                  where: { name: cat },
                  create: { name: cat },
                },
              },
            })),
          },
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async updatePost(params: {
    where: Prisma.PostWhereUniqueInput;
    data: UpdatePostDto;
  }) {
    try {
      const { data, where } = params;
      return this.prisma.post.update({
        data: {
          title: data.title,
          content: data.content,
        },
        where: where,
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    try {
      return this.prisma.post.delete({
        where,
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
