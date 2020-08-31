import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  if(process.env.NODE_ENV === 'development'){
    app.enableCors();
  }
  

  const serverConfig = config.get('server');
  console.log(serverConfig.port);
  

  const port =  process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log('Application Listening on port ' + port);
}
bootstrap();
