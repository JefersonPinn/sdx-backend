import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { hashPassword } from 'src/utils/hash-password';
import { TenantEntity } from 'src/tenants/entities/tenant.entity';
import { UserTenantEntity } from 'src/relations/entities/user-tenant.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(UserTenantEntity)
    private readonly userTenantRepository: Repository<UserTenantEntity>,
    private readonly dataSource: DataSource,
  ) { }

  async registerUser(dto: CreateUserDto): Promise<UserEntity> {
    const { cpf, id_tenant, ...userDataDto } = dto;

    if (!cpf) {
      throw new HttpException('CPF is required', 400);
    }
    if (!id_tenant) {
      throw new HttpException('tenantId is required', 400);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Verificar se o tenant existe
      const tenant = await queryRunner.manager.findOneBy(TenantEntity, { id: id_tenant });
      if (!tenant) {
        throw new NotFoundException(`Tenant with ID "${id_tenant}" not found.`);
      }

      // 2. Verificar se já existe um usuário com o mesmo CPF
      const existingUser = await queryRunner.manager.findOne(UserEntity, { where: { cpf } });
      if (existingUser) {
        throw new ConflictException('User with this CPF already exists.');
      }

      // 3. Se não existe, cria e salva o novo usuário
      const hashedPassword = await hashPassword(userDataDto.password);
      const newUser = queryRunner.manager.create(UserEntity, {
        ...userDataDto,
        cpf,
        password: hashedPassword,
      });
      const savedUser = await queryRunner.manager.save(newUser);

      // 4. Cria e salva a relação user-tenant
      const userTenantRelation = queryRunner.manager.create(UserTenantEntity, {
        user_id: savedUser.id,
        tenant_id: tenant.id,
      });
      await queryRunner.manager.save(userTenantRelation);

      // Efetiva a transação
      await queryRunner.commitTransaction();

      return savedUser;
    } catch (err) {
      // Desfaz a transação em caso de erro
      await queryRunner.rollbackTransaction();
      throw err; // Re-lança o erro para ser tratado pelo NestJS
    } finally {
      // Libera o queryRunner
      await queryRunner.release();
    }
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    const userData =
      await this.userRepository.findOneBy({ id });
    if (!userData) {
      throw new HttpException(
        'User Not Found',
        404,
      );
    }
    return userData;
  }

    async findOnebyName(name: string): Promise<UserEntity> {
    const userData =
      await this.userRepository.findOneBy({ name });
    if (!userData) {
      throw new HttpException(
        'User Not Found',
        404,
      );
    }
    return userData;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const existingUser = await this.findOne(id);
    const userData = this.userRepository.merge(
      existingUser,
      updateUserDto,
    );
    return await this.userRepository.save(
      userData,
    );
  }

  async remove(id: string): Promise<UserEntity> {
    const existingUser = await this.findOne(id);
    return await this.userRepository.remove(
      existingUser,
    );
  }

  async findByLogin(login: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: [{ email: login }, { cpf: login }],
    });
    return user;
  }

  async isUserInTenant(userId: string, tenantId: string): Promise<boolean> {
    const userTenantLink = await this.userTenantRepository.findOne({
      where: {
        user_id: userId,
        tenant_id: tenantId,
      },
    });

    return !!userTenantLink;
  }
}
