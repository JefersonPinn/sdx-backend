import { Request } from 'express';

// Defina a estrutura do payload do seu JWT
// para garantir consistência entre o AuthService e o JwtStrategy.
export interface JwtPayload {
  sub: string;
  tenantId: string;
  role: 'manager' | 'operator'; // Usar um tipo literal é mais seguro que 'string'
  username: string;
  // adicione outras propriedades que você tem no epayload
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}