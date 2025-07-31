import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from 'src/utils/hash-password';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TenantEntity } from 'src/tenants/entities/tenant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(TenantEntity)
    private tenantRepository: Repository<TenantEntity>,
  ) { }

  async validateUser(
    login: string,
    pass: string,
    tenantSlug: string,
  ): Promise<{ user: Omit<UserEntity, 'password'>, tenantId: string }> {
    // 1. Encontrar o tenant pelo slug
    const tenant = await this.tenantRepository.findOneBy({ slug: tenantSlug });
    if (!tenant) {
      throw new NotFoundException(`Empresa com o identificador "${tenantSlug}" não encontrada.`);
    }

    // 2. Encontrar o usuário pelo login (email ou CPF)
    const user = await this.usersService.findByLogin(login);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // 3. Verificar a senha
    const isMatch = await comparePasswords(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // 4. Verificar se o usuário pertence ao tenant
    const isUserInTenant = await this.usersService.isUserInTenant(user.id, tenant.id);
    if (!isUserInTenant) {
      throw new UnauthorizedException(`Usuário não pertence à empresa "${tenant.name}".`);
    }

    // 5. Se tudo estiver correto, retornar os dados do usuário e o ID do tenant
    const { password, ...result } = user;
    return { user: result, tenantId: tenant.id };
  }

  async login(user: Omit<UserEntity, 'password'>, tenantId: string) {
    const payload = { username: user.cpf, sub: user.id, tenantId: tenantId };
    return {
      access_token: this.jwtService.sign(payload),

    };
  }
}
