import { BadRequestException, Injectable } from '@nestjs/common';
import { SubjectBeforeFilterHook } from 'nest-casl';
import { UserDto } from '../../user/dto/user.dto';
import { CurrentUserRequest } from '../../auth/session/session.payload.middleware';
import { plainToInstance } from 'class-transformer';
import { UserProfileService } from '../user-profile.service';
import { UserProfileDto } from '../response/user-profile.dto';

@Injectable()
export class UserProfileHook
  implements SubjectBeforeFilterHook<UserProfileDto, CurrentUserRequest>
{
  constructor(private readonly userProfileService: UserProfileService) {}

  async run(request: CurrentUserRequest) {
    let id: number;
    try {
      id = parseInt(request.params.id);
    } catch (e) {
      throw new BadRequestException();
    }
    const userProfile: UserProfileDto =
      await this.userProfileService.getProfileByUserId(id);
    return plainToInstance(UserProfileDto, userProfile);
  }
}
