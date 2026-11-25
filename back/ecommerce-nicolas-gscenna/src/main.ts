import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(loggerGlobal);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors)=>{
        const cleanErrors = errors.map(error=>{
          return {property : error.property, constraints: error.constraints}
        });
        return new BadRequestException({
          alert: "Se han detectado los siguientes errores en la petición:",
          errors: cleanErrors
        })
      }
    })
  );

  const swaggerConfig = new DocumentBuilder()
                              .setTitle('E-commerce API')
                              .setDescription(`API REST para gestionar usuarios, autenticación, productos, categorías, órdenes e imágenes.\n\nLas rutas protegidas requieren un JWT: inicia sesión en POST /auth/signin y pega el valor del token en Authorize, sin escribir el prefijo Bearer.\n\nLa paginación usa page (desde 1) y limit (cantidad por página). Los ejemplos de request y response están incluidos en cada operación.`)
                              .setVersion('1.0.0')
                              .addBearerAuth(
                                { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Token JWT devuelto por POST /auth/signin.' },
                                'bearer',
                              )
                              .build();

  const document = SwaggerModule.createDocument(app,swaggerConfig);
  SwaggerModule.setup('api',app,document,{
    swaggerOptions: { persistAuthorization: true, operationsSorter: 'alpha', tagsSorter: 'alpha' },
    customSiteTitle: 'E-commerce API | Swagger',
  })
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
