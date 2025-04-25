import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Comment, Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(data: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        content: data.content,
        postId: data.postId,
        authorId: data.authorId,
      },
      include: {
        author: true,
      },
    });
  }

  async comment(
    where: Prisma.CommentWhereUniqueInput,
    include: Prisma.CommentInclude,
  ) {
    return this.prisma.comment.findUnique({
      where: where,
      include: include,
    });
  }

  async comments(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CommentWhereUniqueInput;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput;
    include?: Prisma.CommentInclude;
  }): Promise<Comment[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.comment.findMany({
      skip: skip,
      take: take,
      cursor: cursor,
      where: where,
      orderBy: orderBy,
      include: include,
    });
  }

  async deleteComment(where: Prisma.CommentWhereUniqueInput) {
    return this.prisma.comment.delete({
      where: where,
    });
  }
}
