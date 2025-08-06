import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trace } from '../telemetry/decorators/trace.decorator';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @Trace('UserService.create')
  async create(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = new this.userModel({
      ...registerDto,
      settings: {
        theme: 'light',
        notifications: true,
        defaultPriority: 'medium',
      },
    });

    return user.save();
  }

  @Trace('UserService.findById')
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  @Trace('UserService.findByEmail')
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  @Trace('UserService.findByWalletAddress')
  async findByWalletAddress(walletAddress: string): Promise<User | null> {
    return this.userModel.findOne({ walletAddress }).exec();
  }

  @Trace('UserService.updateById')
  async updateById(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      id,
      { lastLoginAt: new Date() }
    ).exec();
  }

  async deactivateUser(id: string): Promise<User> {
    return this.updateById(id, { isActive: false });
  }

  async activateUser(id: string): Promise<User> {
    return this.updateById(id, { isActive: true });
  }

  async verifyUser(id: string): Promise<User> {
    return this.updateById(id, { isVerified: true });
  }

  @Trace('UserService.deleteById')
  async deleteById(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  @Trace('UserService.findAll')
  async findAll(query: any = {}): Promise<User[]> {
    return this.userModel.find(query).exec();
  }

  async getUserStats(): Promise<{
    total: number;
    verified: number;
    active: number;
    recentSignups: number;
  }> {
    const [total, verified, active, recentSignups] = await Promise.all([
      this.userModel.countDocuments().exec(),
      this.userModel.countDocuments({ isVerified: true }).exec(),
      this.userModel.countDocuments({ isActive: true }).exec(),
      this.userModel.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }).exec(),
    ]);

    return {
      total,
      verified,
      active,
      recentSignups,
    };
  }
}