import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { AuthGuard } from './guards/auth.guards';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { auth } from 'express-openid-connect';
import {config as auth0Config} from './config/auth0.config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { LoggerMiddleware } from './middlewares/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalGuards(new AuthGuard()) //Para hacer la guardia GLOBAL hay que pasarla una instancia de la clase
  // app.useGlobalInterceptors(new MyInterceptor())
  app.use(auth(auth0Config));
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    exceptionFactory:(errors) => {
      const cleanErrors = errors.map ((error) => {
        return {property: error.property, constraints: error.constraints}
      });
      return new BadRequestException({
        alert:'Se han detectado estos errores',
        errors: cleanErrors,
      })
    }
  }),
)
  app.use(loggerGlobal) //para hacer un middleware global solamente, que pase por todas las rutas
  
  const swaggerConfig = new DocumentBuilder()
                            .setTitle('ProjectZ')
                            .setDescription('this API was built in 2024 for module 4 of henry.')
                            .setVersion('1.0')
                            .addBearerAuth()
                            .build();

const document = SwaggerModule.createDocument(app,swaggerConfig);
SwaggerModule.setup('api',app,document)
  await app.listen(3000);
}
bootstrap();
