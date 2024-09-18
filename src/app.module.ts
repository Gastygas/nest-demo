import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guards';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm'
import { JwtModule } from '@nestjs/jwt';

// imports: [ModuleBelex],
// @Global() //vuelve el modulo global sin necesidad de importarlo

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load:[typeOrmConfig]
    })
    ,TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (confService:ConfigService) => confService.get('typeorm')
    })
    ,UsersModule,
    TodosModule,
    JwtModule.register({
      global:true,
      signOptions:{ expiresIn: '1h'},
      secret: process.env.JWT_SECRET,
    })
  ],
  controllers: [],
  providers: [
    // {
    //   provide:APP_GUARD,
    //   useClass:AuthGuard
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass:myClass
    // }
  ],
})
export class AppModule {}
