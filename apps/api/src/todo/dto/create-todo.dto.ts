import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsEnum, IsArray, IsDateString, MaxLength, MinLength } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ description: 'Todo title', example: 'Complete project documentation', minLength: 1, maxLength: 200 })
  @IsString()
  @MinLength(1, { message: 'Title must not be empty' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiProperty({
    description: 'Todo description',
    example: 'Write comprehensive documentation for the todo application',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiProperty({
    description: 'Todo priority level',
    enum: ['low', 'medium', 'high'],
    example: 'medium',
    required: false,
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'], { message: 'Priority must be low, medium, or high' })
  priority?: 'low' | 'medium' | 'high';

  @ApiProperty({ description: 'Todo due date', example: '2024-01-15T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid ISO date string' })
  dueDate?: string;

  @ApiProperty({ description: 'Todo tags', example: ['work', 'documentation'], type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value.map((tag: string) => tag?.trim()).filter(Boolean) : []))
  tags?: string[];
}
