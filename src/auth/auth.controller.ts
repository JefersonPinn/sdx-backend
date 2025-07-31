import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO } from './dto/login-dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() { login, password, tenantSlug }: loginDTO) {
    const { user, tenantId } = await this.authService.validateUser(
      login,
      password,
      tenantSlug,
    );

    return this.authService.login(user, tenantId);
  }

  // Esta rota é protegida. Só pode ser acessada com um JWT válido.
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // O objeto `user` é adicionado à requisição pela nossa JwtStrategy
    return req.user;
  }
}
