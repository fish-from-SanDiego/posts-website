import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Comment, Prisma } from '@prisma/client';
import { Subject } from 'rxjs';
import { conflict, notFound } from './exceptions';

export interface CommentDeletedEvent {
  commentId: number;
  postId: number;
}

export interface CommentCreatedEvent {
  comment: Awaited<ReturnType<typeof CommentService.prototype.createComment>>;
}

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  public readonly pageSize = 10;
  private commentsDeletionEvents = new Subject<CommentDeletedEvent>();
  private commentsCreationEvents = new Subject<CommentCreatedEvent>();

  public sendCommentDeletionObservable() {
    return this.commentsDeletionEvents.asObservable();
  }

  public sendCommentCreationObservable() {
    return this.commentsCreationEvents.asObservable();
  }

  async createComment(data: CreateCommentDto) {
    try {
      const res = await this.prisma.comment.create({
        data: {
          content: data.content,
          postId: data.postId,
          authorId: data.authorId,
        },
        include: {
          author: true,
        },
      });
      this.commentsCreationEvents.next({
        comment: res,
      });
      return res;
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async comment(
    where: Prisma.CommentWhereUniqueInput,
    include: Prisma.CommentInclude,
  ) {
    try {
      return await this.prisma.comment.findUnique({
        where: where,
        include: include,
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async comments(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CommentWhereUniqueInput;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput;
    include?: Prisma.CommentInclude;
  }): Promise<Comment[]> {
    try {
      const { skip, take, cursor, where, orderBy, include } = params;
      return await this.prisma.comment.findMany({
        skip: skip,
        take: take,
        cursor: cursor,
        where: where,
        orderBy: orderBy,
        include: include,
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async commentLastOfPost(postId: number) {
    try {
      return await this.comments({
        where: {
          postId: postId,
        },
        orderBy: {
          id: 'desc',
        },
        take: 1,
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async commentsOfPostPaged(postId: number, cursorId?: number) {
    try {
      if (cursorId == null)
        return await this.comments({
          orderBy: { id: 'desc' },
          where: { postId: postId },
          take: this.pageSize,
          include: {
            author: true,
          },
        });
      else {
        const res = await this.comments({
          orderBy: { id: 'desc' },
          where: { postId: postId },
          take: this.pageSize,
          cursor: { id: cursorId },
          include: {
            author: true,
          },
        });
        if (res == null) return res;
        if (res.length == 0 || res[0].id != cursorId) return res;
        return res.slice(1);
      }
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async deleteComment(where: Prisma.CommentWhereUniqueInput) {
    try {
      const deletedComment = await this.prisma.comment.delete({
        where: where,
      });
      this.commentsDeletionEvents.next({
        commentId: deletedComment.id,
        postId: deletedComment.postId,
      });
      return deletedComment;
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
