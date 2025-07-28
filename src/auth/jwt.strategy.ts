// e:\programas\sdx-backend\src\auth\jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // O Passport verifica a assinatura do JWT e decodifica o JSON.
  // Em seguida, invoca o `validate()` passando o payload decodificado.
  async validate(payload: any) {
    // Aqui, podemos enriquecer o objeto `request.user` com mais dados do usuário se necessário.
    // O que for retornado aqui será anexado ao objeto Request.
    return { userId: payload.sub, username: payload.username };
  }
}
