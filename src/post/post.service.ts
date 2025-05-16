import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';
import { conflict, notFound } from './exceptions';
import { CreatePostRawDto } from './dto/create-post.raw.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  public readonly pageSize = 10;

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

  async postsPaged(pageN: number, categoryName?: string) {
    try {
      const searchCategory = categoryName
        ? {
            categories: {
              some: {
                category: {
                  name: categoryName,
                },
              },
            },
          }
        : {};
      return await this.prisma.$transaction(async (tx) => {
        const postsCount = await tx.post.count();
        const skippedPagesN =
          (pageN - 1) * this.pageSize >= postsCount
            ? Math.max(0, Math.ceil(postsCount / this.pageSize) - 1)
            : pageN - 1;
        return {
          data: await this.prisma.post.findMany({
            skip: skippedPagesN * this.pageSize,
            take: this.pageSize,
            orderBy: {
              id: 'desc',
            },
            where: { ...searchCategory },
            include: {
              author: true,
            },
          }),
          postsCount: postsCount,
          pageSize: this.pageSize,
          pageNumber: skippedPagesN + 1,
        };
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async postsByCategories(page: number, categoryNames?: string[]) {
    const skip = (page - 1) * this.pageSize;
    console.log(categoryNames);
    const where =
      categoryNames && categoryNames.length > 0
        ? {
            categories: {
              some: {
                category: {
                  name: { in: categoryNames },
                },
              },
            },
          }
        : {};

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        skip,
        take: this.pageSize,
        include: {
          categories: {
            include: { category: true },
          },
          author: true,
        },
      }),
      this.prisma.post.count({ where }),
    ]);
    return { posts, total };
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

  async getPost(where: Prisma.PostWhereUniqueInput) {
    try {
      const post = await this.post(where);
      if (post == null) throw notFound();
      return post;
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

  async createPost(data: CreatePostRawDto) {
    try {
      return await this.prisma.post.create({
        data: {
          title: data.title,
          content: data.content,
          author: {
            connect: { id: +data.authorId },
          },
          categories: {
            create: (data.categoryNames ?? []).map((cat) => ({
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
          author: true,
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
    const { data, where } = params;

    const { categoryNames, ...rest } = data;

    try {
      return await this.prisma.post.update({
        where,
        data: {
          ...rest,
          ...(categoryNames
            ? {
                categories: {
                  deleteMany: {}, // удаляет все старые связи
                  create: categoryNames.map((name) => ({
                    category: {
                      connectOrCreate: {
                        where: { name },
                        create: { name },
                      },
                    },
                  })),
                },
              }
            : {}),
        },
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    try {
      return await this.prisma.post.delete({
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
