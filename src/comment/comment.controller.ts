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
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { filter, map, tap } from 'rxjs';
import { ApiExcludeController } from '@nestjs/swagger';
import {
  PublicAccess,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { SupertokensHtmlExceptionFilter } from '../auth/auth.filter';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { CommentDto } from './dto/comment.dto';
import { Session } from '../auth/session/session.decorator';
import { SessionContainerInterface } from 'supertokens-node/lib/build/recipe/session/types';
import { CreateCommentRawDto } from './dto/create-comment.raw.dto';
import { CommentHook } from './permissions/comment.hook';

@ApiExcludeController(true)
@Controller()
@UseGuards(new SuperTokensAuthGuard())
@UseFilters(SupertokensHtmlExceptionFilter)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('comments')
  @VerifySession({ options: { checkDatabase: true } })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, CommentDto)
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Session() session: SessionContainerInterface,
  ) {
    const trimmedDto: CreateCommentRawDto = {
      ...createCommentDto,
      content: createCommentDto.content.trim(),
      authorId: session.getAccessTokenPayload().userId,
    };
    return this.commentService.createComment(trimmedDto);
  }

  @Sse('posts/:postId/comments/sse/deleted')
  @PublicAccess()
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
  @PublicAccess()
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

  @Delete('comments/:id')
  @VerifySession({ options: { checkDatabase: true } })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, CommentDto, CommentHook)
  async deleteComment(@Param('id', ParseIntPipe) commentId: number) {
    return await this.commentService.deleteComment({
      id: commentId,
    });
  }

  @Get('posts/:postId/comments')
  @PublicAccess()
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
