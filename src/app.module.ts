import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { LoggerModule } from 'nestjs-pino';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/my-chat'),
    UserModule,
    LoggerModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
