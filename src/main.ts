import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  // ! Utiliser une antivirus qui verifie les fichiers reçu

  // Middleware qui permet d'upload des fichiers avec graphql
  app.use(graphqlUploadExpress({ maxFileSize: 2_000_000 }));

  // Middleware qui permet la validation de données
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port || 8000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
