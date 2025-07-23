import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class LoginDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({ description: 'User password', example: 'SecurePassword123!' })
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}