import { BadRequestException, Injectable } from '@nestjs/common';
import { SubjectBeforeFilterHook } from 'nest-casl';
import { CurrentUserRequest } from '../../auth/session/session.payload.middleware';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../user.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserHook
  implements SubjectBeforeFilterHook<UserDto, CurrentUserRequest>
{
  constructor(private readonly userService: UserService) {}

  async run(request: CurrentUserRequest) {
    let id: number;
    try {
      id = parseInt(request.params.id);
    } catch (e) {
      throw new BadRequestException();
    }
    const user: UserDto = await this.userService.getUserById(id);
    return plainToInstance(UserDto, user);
  }
}
