import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GeneralResponseInterceptor } from './common/interceptors/general-response-interceptor';
import { HttpExceptionFilter } from './common/exeption-filters/http-exeptions.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: [
      'https://meduzzen-client-476208119955.europe-west10.run.app',
      configService.getOrThrow('CLIENT_URL'),
      '*',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new GeneralResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Meduzzen App')
    .setDescription('Description API')
    .setVersion('1.0')
    .addTag('API')
    .addCookieAuth('auth', { type: 'apiKey' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.getOrThrow<number>('PORT'));
}
bootstrap();
