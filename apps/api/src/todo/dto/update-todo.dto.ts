import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiProperty({ description: 'Todo completion status', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiProperty({ description: 'Blockchain network where todo is stored', enum: ['solana', 'polkadot', 'polygon'], required: false })
  @IsOptional()
  @IsEnum(['solana', 'polkadot', 'polygon'], { message: 'Blockchain network must be solana, polkadot, or polygon' })
  blockchainNetwork?: 'solana' | 'polkadot' | 'polygon';

  @ApiProperty({ description: 'Blockchain transaction hash', example: '0x1234567890abcdef', required: false })
  @IsOptional()
  @IsString()
  transactionHash?: string;

  @ApiProperty({ description: 'Blockchain address', example: 'solana-address-123', required: false })
  @IsOptional()
  @IsString()
  blockchainAddress?: string;
}