import { Controller, Post, Req, HttpCode, Res, Body } from '@nestjs/common';
import { Request, Response } from 'express';

interface CustomRequest extends Request {
    id?: string;
}

@Controller('cookie')
export class CookieController {
    @Post('client-data')
    @HttpCode(200)
    collectClientData(@Req() req: CustomRequest) {
        const clientIp = req.ip || req.ips.join(', ');
        const userAgent = req.headers['user-agent'];
        const acceptLanguage = req.headers['accept-language'];
        const referrer = req.headers['referer'];
        const secChUa = req.headers['sec-ch-ua'];

        const primaryLanguage = acceptLanguage?.split(',')[0].split(';')[0] || 'unknown';

        const isMobile = /mobile/i.test(userAgent || '');
        const deviceType = isMobile ? 'mobile' : 'desktop';

        const timezone = req.headers['time-zone'] || 'unknown';

        const clientData = {
            connection: {
                ip: clientIp,
                proxy: req.ips.length > 1,
            },
            browser: {
                type: this.parseBrowserType(userAgent),
                version: this.parseBrowserVersion(userAgent),
                platform: this.parsePlatform(userAgent),
                isBot: this.isBot(userAgent),
                secChUa: secChUa,
            },
            language: {
                preferred: primaryLanguage,
                all: acceptLanguage,
            },
            device: {
                type: deviceType,
                isTouchSupported: req.headers['touch-support'] === 'true',
            },
            time: {
                timezone: timezone,
                serverTime: new Date().toISOString(),
            },
            network: {
                secure: req.secure,
                protocol: req.protocol,
            },
            meta: {
                referrer: referrer,
                requestId: req.id,
            }
        };

        return {
            success: true,
            data: clientData
        };
    }

    private parseBrowserType(ua?: string): string {
        if (!ua) return 'unknown';
        if (/chrome|chromium/i.test(ua)) return 'chrome';
        if (/firefox|fxios/i.test(ua)) return 'firefox';
        if (/safari/i.test(ua)) return 'safari';
        if (/opr|opera/i.test(ua)) return 'opera';
        if (/edg/i.test(ua)) return 'edge';
        if (/msie|trident/i.test(ua)) return 'ie';
        return 'unknown';
    }

    private parseBrowserVersion(ua?: string): string {
        const matches = ua?.match(/(chrome|firefox|version|opera|edge|safari)[\/\s](\d+)/i);
        return matches?.[2] || 'unknown';
    }

    private parsePlatform(ua?: string): string {
        if (!ua) return 'unknown';
        if (/windows/i.test(ua)) return 'windows';
        if (/macintosh|mac os/i.test(ua)) return 'mac';
        if (/linux/i.test(ua)) return 'linux';
        if (/android/i.test(ua)) return 'android';
        if (/ios|iphone|ipad/i.test(ua)) return 'ios';
        return 'unknown';
    }

    private isBot(ua?: string): boolean {
        return !!ua && (/bot|spider|crawl|slurp|search/i.test(ua));
    }

    @Post('set')
    @HttpCode(200)
    setCookie(@Res({ passthrough: true }) res: Response, @Body() body: any) {
        const value = body?.value || 'default_token_value';

        res.cookie('session_token', value, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return { message: 'Cookie set successfully' };
    }

    @Post('clear')
    @HttpCode(200)
    clearCookie(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('session_token', { path: '/' });
        return { message: 'Cookie cleared' };
    }
}
