import { Module } from '@nestjs/common';
import { ContactModule } from '../contacts/contact.module';
import { ChatService } from './chat.service';
import { ChatWebsocketGateway } from './chat.websocket.gateway';
import { RoomsController } from './rooms.controller';

@Module({
  imports: [ContactModule],
  controllers: [RoomsController],
  providers: [ChatWebsocketGateway, ChatService],
})
export class ChatModule {}
