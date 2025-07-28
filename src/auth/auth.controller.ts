import { Controller, Get, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { loginDTO } from './dto/login-dto'; 



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: loginDTO) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password || '');
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas'); // Em produção, use HttpException
    }
    return this.authService.login(user);
  }

  // Esta rota é protegida. Só pode ser acessada com um JWT válido.
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    // O objeto `user` é adicionado à requisição pela nossa JwtStrategy
    return req.user;
  }
}
