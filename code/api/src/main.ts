import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as session from 'express-session';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.use(session({ secret: 'epix.io' })); // TODO: move to .env
  app.use(csurf({ session: true }));
  app.enableCors();
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Invoice Nest')
    .setDescription('Invoice Nest API description')
    .setVersion('1.0')
    .addTag('invoices')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
