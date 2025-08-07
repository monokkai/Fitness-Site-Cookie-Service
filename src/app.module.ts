import { Module } from '@nestjs/common';
import { CookieModule } from './cookie/cookie.module';

@Module({
    imports: [CookieModule],
})
export class AppModule { }
