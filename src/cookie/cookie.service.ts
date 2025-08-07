import { Injectable } from '@nestjs/common';
import CreateCookieDto from './dto/create-cookie.dto';

@Injectable()
export class CookieService {
    private storage: CreateCookieDto[] = [];

    create(data: CreateCookieDto): { status: string; storedRecords: number } {
        this.storage.push(data);
        return { status: 'success', storedRecords: this.storage.length };
    }

    findAll(): CreateCookieDto[] {
        return this.storage;
    }
}
