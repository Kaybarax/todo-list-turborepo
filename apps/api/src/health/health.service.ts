import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private connection: Connection) {}

  async getHealth() {
    const dbStatus = this.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStatus,
        name: this.connection.name,
      },
      memory: process.memoryUsage(),
      version: process.version,
    };
  }

  async getReadiness() {
    const isDbReady = this.connection.readyState === 1;
    
    return {
      status: isDbReady ? 'ready' : 'not ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: isDbReady,
      },
    };
  }
}