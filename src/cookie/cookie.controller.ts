import { Controller, Post, Body, Get } from '@nestjs/common';
import { CookieService } from './cookie.service';
import CreateCookieDto from './dto/create-cookie.dto';

@Controller()
export class CookieController {
    constructor(private readonly cookieService: CookieService) { }

    @Post("collect")
    create(@Body() createCookieDto: CreateCookieDto) {
        return this.cookieService.create(createCookieDto);
    }

    @Get("health")
    health() {
        return { status: "OK" }
    }
}
