import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async findById(id: string) {
    // TODO: Implement user lookup by ID
    return { message: 'User service will be implemented in a future task' };
  }

  async findByEmail(email: string) {
    // TODO: Implement user lookup by email
    return { message: 'User service will be implemented in a future task' };
  }
}