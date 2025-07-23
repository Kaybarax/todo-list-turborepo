import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';
import { Todo } from './schemas/todo.schema';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Todos')
@Controller('todos')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'Todo created successfully', type: Todo })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Body() createTodoDto: CreateTodoDto,
    // @CurrentUser() user: { id: string },
  ): Promise<Todo> {
    // For now, use a mock user ID until auth is implemented
    const userId = 'mock-user-id';
    return this.todoService.create(createTodoDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Todos retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'completed', required: false, description: 'Filter by completion status' })
  @ApiQuery({ name: 'priority', required: false, description: 'Filter by priority' })
  @ApiQuery({ name: 'search', required: false, description: 'Search in title and description' })
  async findAll(
    @Query() queryDto: QueryTodoDto,
    // @CurrentUser() user: { id: string },
  ) {
    // For now, use a mock user ID until auth is implemented
    const userId = 'mock-user-id';
    return this.todoService.findAll(queryDto, userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get todo statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats(
    // @CurrentUser() user: { id: string },
  ) {
    // For now, use a mock user ID until auth is implemented
    const userId = 'mock-user-id';
    return this.todoService.getStats(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by ID' })
  @ApiResponse({ status: 200, description: 'Todo retrieved successfully', type: Todo })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findOne(
    @Param('id') id: string,
    // @CurrentUser() user: { id: string },
  ): Promise<Todo> {
    // For now, use a mock user ID until auth is implemented
    const userId = 'mock-user-id';
    return this.todoService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo' })
  @ApiResponse({ status: 200, description: 'Todo updated successfully', type: Todo })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    // @CurrentUser() user: { id: string },
  ): Promise<Todo> {
    // For now, use a mock user ID until auth is implemented
    const userId = 'mock-user-id';
    return this.todoService.update(id, updateTodoDto, userId);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle todo completion status' })
  @ApiResponse({ status: 200, description: 'Todo toggled successfully', type: Todo })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async toggleComplete(
    @Param('id') id: string,
    // @CurrentUser() user: { id: string },
  ): Promise<Todo> {
    // For now, use a mock user ID until auth is implemented
    const userId = 'mock-user-id';
    return this.todoService.toggleComplete(id, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({ status: 204, description: 'Todo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async remove(
    @Param('id') id: string,
    // @CurrentUser() user: { id: string },
  ): Promise<void> {
    // For now, use a mock user ID until auth is implemented
    const userId = 'mock-user-id';
    return this.todoService.remove(id, userId);
  }
}