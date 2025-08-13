import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../user/schemas/user.schema';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken: string;

  @ApiProperty({ description: 'User information' })
  user: Omit<User, 'password'>;

  @ApiProperty({ description: 'Token expiration time in seconds' })
  expiresIn: number;
}
