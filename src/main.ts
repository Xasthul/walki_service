import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: app.get(ConfigService).get('SESSION_SECRET') as string,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: +36000000 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: app.get(ConfigService).get<string>('FRONTEND_URL'),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Walki App Service')
    .setDescription('Service for Walki mobile app')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  const port = app.get(ConfigService).get('PORT') as number;
  await app.listen(port);
}
bootstrap();

// TODO: update google places ids once a year https://developers.google.com/maps/documentation/places/web-service/place-id#refresh-id
