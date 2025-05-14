import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Sse,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { filter, map, tap } from 'rxjs';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request } from 'express';
import { VerifySession } from 'supertokens-nestjs';

@ApiExcludeController(true)
@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('comments')
  @VerifySession()
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    const trimmedDto = {
      ...createCommentDto,
      content: createCommentDto.content.trim(),
    };
    return this.commentService.createComment(trimmedDto);
  }

  @Sse('posts/:postId/comments/sse/deleted')
  sseOfPostDeleted(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentService.sendCommentDeletionObservable().pipe(
      filter((event) => event.postId === postId),
      tap((event) => console.log(`${event.commentId}: deleted`)),
      map((event) => ({
        event: 'commentDeleted',
        data: event,
      })),
    );
  }

  @Sse('posts/:postId/comments/sse/new')
  sseOfPostNew(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentService.sendCommentCreationObservable().pipe(
      filter((event) => event.comment.postId === postId),
      tap((event) => console.log(`${event.comment.id}: new`)),
      map((event) => ({
        event: 'commentCreated',
        data: event,
      })),
    );
  }

  @Delete('comments/:commentId')
  async deleteComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentService.deleteComment({
      id: commentId,
    });
  }

  @Get('posts/:postId/comments')
  async listCommentsForPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Query('cursorId', new ParseIntPipe({ optional: true })) cursorId?: number,
  ) {
    const res = await this.commentService.commentsOfPostPaged(
      postId,
      cursorId ? +cursorId : undefined,
    );
    const cursorValid =
      cursorId == null || res.length === 0 || res[0].id < cursorId;
    return {
      cursorValid: cursorValid,
      data: res,
      pageSize: this.commentService.pageSize,
    };
  }
}
