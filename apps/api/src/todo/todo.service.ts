import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';

export interface PaginatedTodos {
  todos: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    const todo = new this.todoModel({
      ...createTodoDto,
      userId,
      dueDate: createTodoDto.dueDate ? new Date(createTodoDto.dueDate) : undefined,
    });
    
    return todo.save();
  }

  async findAll(queryDto: QueryTodoDto, userId: string): Promise<PaginatedTodos> {
    const { page, limit, completed, priority, blockchainNetwork, search, tag, sortBy, sortOrder } = queryDto;
    
    // Build filter query
    const filter: FilterQuery<TodoDocument> = { userId };
    
    if (completed !== undefined) {
      filter.completed = completed;
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (blockchainNetwork) {
      filter.blockchainNetwork = blockchainNetwork;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (tag) {
      filter.tags = { $in: [tag] };
    }

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    if (sortBy === 'priority') {
      // Custom priority sorting: high -> medium -> low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      sort.priority = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Execute queries
    const [todos, total] = await Promise.all([
      this.todoModel
        .find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.todoModel.countDocuments(filter).exec(),
    ]);

    return {
      todos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string): Promise<Todo> {
    const todo = await this.todoModel.findById(id).exec();
    
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    
    if (todo.userId !== userId) {
      throw new ForbiddenException('You can only access your own todos');
    }
    
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, userId: string): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    
    const updateData = {
      ...updateTodoDto,
      dueDate: updateTodoDto.dueDate ? new Date(updateTodoDto.dueDate) : updateTodoDto.dueDate,
    };
    
    Object.assign(todo, updateData);
    return todo.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const todo = await this.findOne(id, userId);
    await this.todoModel.findByIdAndDelete(id).exec();
  }

  async getStats(userId: string): Promise<{
    total: number;
    completed: number;
    active: number;
    overdue: number;
    byPriority: Record<string, number>;
    byBlockchainNetwork: Record<string, number>;
  }> {
    const [
      total,
      completed,
      overdue,
      priorityStats,
      blockchainStats,
    ] = await Promise.all([
      this.todoModel.countDocuments({ userId }).exec(),
      this.todoModel.countDocuments({ userId, completed: true }).exec(),
      this.todoModel.countDocuments({
        userId,
        completed: false,
        dueDate: { $lt: new Date() },
      }).exec(),
      this.todoModel.aggregate([
        { $match: { userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]).exec(),
      this.todoModel.aggregate([
        { $match: { userId, blockchainNetwork: { $exists: true } } },
        { $group: { _id: '$blockchainNetwork', count: { $sum: 1 } } },
      ]).exec(),
    ]);

    const byPriority = priorityStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {} as Record<string, number>);

    const byBlockchainNetwork = blockchainStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      completed,
      active: total - completed,
      overdue,
      byPriority,
      byBlockchainNetwork,
    };
  }

  async toggleComplete(id: string, userId: string): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    todo.completed = !todo.completed;
    return todo.save();
  }
}