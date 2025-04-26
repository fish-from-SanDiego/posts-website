import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Sse,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { filter, map } from 'rxjs';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController(true)
@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('comments')
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(createCommentDto);
  }

  @Sse('posts/:postId/comments/sse/deleted')
  sseOfPostDeleted(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentService.sendCommentDeletionObservable().pipe(
      filter((event) => event.postId === postId),
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
    console.log(res);
    console.log(cursorId);
    return {
      cursorValid: cursorValid,
      data: res,
      pageSize: this.commentService.pageSize,
    };
  }
}
