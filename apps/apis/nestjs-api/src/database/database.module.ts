import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const databaseConfig = configService.get('database');
        const uri = configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/todos';

        return {
          uri,
          ...databaseConfig?.options,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
