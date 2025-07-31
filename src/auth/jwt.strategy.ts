// e:\programas\sdx-backend\src\auth\jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './request-with-user.interface';

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
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // O que for retornado aqui será anexado ao objeto Request como `req.user`.
    // Ao retornar o payload diretamente, garantimos que `req.user` terá
    // as propriedades `sub`, `username` e `tenantId`, como esperado no controller.
    return payload;
  }
}
