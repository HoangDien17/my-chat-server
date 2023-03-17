import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http.exeption.filter';
import * as httpContext from 'express-http-context';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(httpContext.middleware);
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('My Chat')
    .setDescription('My chat API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'apiKey', name: 'access-token', in: 'header' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(5000);
}
bootstrap();
