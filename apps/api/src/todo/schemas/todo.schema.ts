import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TodoDocument = Todo & Document;

@Schema({ timestamps: true })
export class Todo {
  @ApiProperty({ description: 'Todo title', example: 'Complete project documentation' })
  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @ApiProperty({
    description: 'Todo description',
    example: 'Write comprehensive documentation for the todo application',
    required: false,
  })
  @Prop({ trim: true, maxlength: 1000 })
  description?: string;

  @ApiProperty({ description: 'Todo completion status', example: false })
  @Prop({ default: false })
  completed: boolean;

  @ApiProperty({ description: 'Todo priority level', enum: ['low', 'medium', 'high'], example: 'medium' })
  @Prop({ enum: ['low', 'medium', 'high'], default: 'medium' })
  priority: 'low' | 'medium' | 'high';

  @ApiProperty({ description: 'Todo due date', example: '2024-01-15T00:00:00.000Z', required: false })
  @Prop({ type: Date })
  dueDate?: Date;

  @ApiProperty({ description: 'Todo tags', example: ['work', 'documentation'], type: [String] })
  @Prop({ type: [String], default: [] })
  tags: string[];

  @ApiProperty({ description: 'User ID who owns this todo', example: 'user123' })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({
    description: 'Blockchain network where todo is stored',
    enum: ['solana', 'polkadot', 'polygon'],
    required: false,
  })
  @Prop({ enum: ['solana', 'polkadot', 'polygon'] })
  blockchainNetwork?: 'solana' | 'polkadot' | 'polygon';

  @ApiProperty({ description: 'Blockchain transaction hash', example: '0x1234567890abcdef', required: false })
  @Prop()
  transactionHash?: string;

  @ApiProperty({ description: 'Blockchain address', example: 'solana-address-123', required: false })
  @Prop()
  blockchainAddress?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

// Add indexes for better query performance
TodoSchema.index({ userId: 1, createdAt: -1 });
TodoSchema.index({ userId: 1, completed: 1 });
TodoSchema.index({ userId: 1, priority: 1 });
TodoSchema.index({ userId: 1, dueDate: 1 });
TodoSchema.index({ userId: 1, tags: 1 });
