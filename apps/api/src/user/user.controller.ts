import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly userService: UserService,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  getProfile() {
    // TODO: Implement user profile retrieval
    return { message: 'User profile will be implemented in a future task' };
  }
}
