import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  Participant,
  ChatDto,
  toMessageDto,
  RoomData,
  RoomDto,
  dataContactDto,
} from './chat.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ContactService } from '../contacts/contact.service';
import { CreateContactDto } from '../contacts/contact.dto';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@WebSocketGateway({ cors: true })
export class ChatWebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server;

  private static rooms: Map<string, RoomData> = new Map();
  private static participants: Map<string, string> = new Map(); // sockedId => roomId
  constructor(
    @InjectPinoLogger(ChatWebsocketGateway.name) private logger: PinoLogger,
    private readonly contactService: ContactService,
  ) {}
  handleConnection(socket: Socket): void {
    const socketId = socket.id;
    this.logger.info(`New connecting... socket id: ${socketId}`);
  }

  handleDisconnect(socket: Socket): void {
    const socketId = socket.id;
    this.logger.info(`Disconnection... socket id: ${socketId}`);
    // const roomId = ChatWebsocketGateway.participants.get(socketId);
    // const room = ChatWebsocketGateway.rooms.get(roomId);
    // if (room) {
    //   room.participants.get(socketId).connected = false;
    //   this.server.emit(
    //     `participants/${roomId}`,
    //     Array.from(room.participants.values()),
    //   );
    // }
    ChatWebsocketGateway.participants.delete(socketId);
  }

  @SubscribeMessage('connected')
  async onConnected(
    @MessageBody() message: { userId: string; socketId: string },
  ) {
    // ChatWebsocketGateway.participants.set(message.socketId, message.userId);
    // ChatWebsocketGateway.participants.set(socketId, '');
  }

  @SubscribeMessage('participants')
  async onParticipate(socket: Socket, participant: Participant) {
    const socketId = socket.id;
    this.logger.info(
      `Registering new participant... socket id: %s and participant: `,
      socketId,
      participant,
    );

    const roomId = participant.roomId;
    if (!ChatWebsocketGateway.rooms.has(roomId)) {
      this.logger.info(
        'Room with id: %s was not found, disconnecting the participant',
        roomId,
      );
      socket.disconnect();
      throw new ForbiddenException('The access is forbidden');
    }

    const room = ChatWebsocketGateway.rooms.get(roomId);
    // ChatWebsocketGateway.participants.set(socketId, roomId);
    participant.connected = true;
    room.participants.set(socketId, participant);
    // when received new participant we notify the chatter by room
    this.server.emit(
      `participants/${roomId}`,
      Array.from(room.participants.values()),
    );
  }

  @SubscribeMessage('exchanges')
  async onMessage(socket: Socket, message: ChatDto) {
    const socketId = socket.id;
    message.socketId = socketId;
    this.logger.info(
      'Received new message... socketId: %s, message: ',
      socketId,
      message,
    );
    const roomId = message.roomId;
    const roomData = ChatWebsocketGateway.rooms.get(roomId);
    message.order = roomData.messages.length + 1;
    roomData.messages.push(message);
    ChatWebsocketGateway.rooms.set(roomId, roomData);
    // when received message we notify the chatter by room
    this.server.emit(roomId, toMessageDto(message));
  }

  @SubscribeMessage('add-contact')
  async onAddContact(@MessageBody() message: CreateContactDto) {
    await this.contactService.createContact(message);
    return { message: 'Successfully' };
  }

  @SubscribeMessage('send-message')
  async onSendmessage(
    @MessageBody() message: { message: string; socketId: string },
  ) {
    this.server.emit('receive-message', message);
    return { message: 'Successfully' };
  }

  @SubscribeMessage('connecting')
  async onAddContactg(
    @MessageBody() message: { userId: string; socketId: string },
  ) {
    ChatWebsocketGateway.participants.set(message.socketId, message.userId);

    return { message: 'Successfully' };
  }

  static get(roomId: string): RoomData {
    return this.rooms.get(roomId);
  }

  static createRoom(roomDto: RoomDto): void {
    const roomId = roomDto.roomId;
    if (this.rooms.has(roomId)) {
      throw new ConflictException({
        code: 'room.conflict',
        message: `Room with '${roomId}' already exists`,
      });
    }
    this.rooms.set(roomId, new RoomData(roomDto.creatorUsername));
  }

  static close(roomId: string) {
    if (!this.rooms.has(roomId)) {
      throw new NotFoundException({
        code: 'room.not-fond',
        message: `Room with '${roomId}' not found`,
      });
    }
    this.rooms.delete(roomId);
  }

  static getKey(input, value) {
    return [...input.entries()]
      .filter(({ 1: v }) => v === value)
      .map(([k]) => k);
  }
}
