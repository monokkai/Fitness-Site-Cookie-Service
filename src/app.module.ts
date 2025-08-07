import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { RequestIdMiddleware } from './middlewares/request-id.middleware';
import { CookieModule } from './cookie/cookie.module';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

@Module({
    imports: [CookieModule],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestIdMiddleware).forRoutes('*');
    }
}
