import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({ description: 'User password', example: 'SecurePassword123!', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ description: 'User display name', example: 'John Doe', maxLength: 100 })
  @IsString()
  @MinLength(1, { message: 'Name is required' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({ description: 'User wallet address', example: '0x1234567890abcdef', required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  walletAddress?: string;

  @ApiProperty({
    description: 'Preferred blockchain network',
    enum: ['solana', 'polkadot', 'polygon'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['solana', 'polkadot', 'polygon'], { message: 'Preferred network must be solana, polkadot, or polygon' })
  preferredNetwork?: 'solana' | 'polkadot' | 'polygon';
}
