import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: [
            "http://localhost:3000",
            // "http://frontend:3000",
            "http://localhost:5003"
        ],
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
