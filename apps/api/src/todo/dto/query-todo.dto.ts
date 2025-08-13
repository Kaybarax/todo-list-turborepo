import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsBoolean, IsNumberString, Min, Max } from 'class-validator';

export class QueryTodoDto {
  @ApiProperty({ description: 'Page number for pagination', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiProperty({ description: 'Number of items per page', example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit must not exceed 100' })
  limit?: number = 10;

  @ApiProperty({ description: 'Filter by completion status', example: false, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  completed?: boolean;

  @ApiProperty({ description: 'Filter by priority level', enum: ['low', 'medium', 'high'], required: false })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'], { message: 'Priority must be low, medium, or high' })
  priority?: 'low' | 'medium' | 'high';

  @ApiProperty({
    description: 'Filter by blockchain network',
    enum: ['solana', 'polkadot', 'polygon'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['solana', 'polkadot', 'polygon'], { message: 'Blockchain network must be solana, polkadot, or polygon' })
  blockchainNetwork?: 'solana' | 'polkadot' | 'polygon';

  @ApiProperty({ description: 'Search in title and description', example: 'documentation', required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @ApiProperty({ description: 'Filter by tag', example: 'work', required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  tag?: string;

  @ApiProperty({
    description: 'Sort field',
    enum: ['createdAt', 'updatedAt', 'title', 'priority', 'dueDate'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['createdAt', 'updatedAt', 'title', 'priority', 'dueDate'], { message: 'Invalid sort field' })
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'dueDate' = 'createdAt';

  @ApiProperty({ description: 'Sort order', enum: ['asc', 'desc'], required: false })
  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'Sort order must be asc or desc' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
