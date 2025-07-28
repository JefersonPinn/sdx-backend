import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/utils/hash-password';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async registerUser(dto: CreateUserDto,): Promise<UserEntity> {
    // 1. Verificar se já existe um usuário com o mesmo CPF
    // Assumindo que createUserDto.cpf existe e é o campo a ser validado
    const { cpf } = dto
    if (!dto.cpf) {
      // Opcional: Tratar caso o CPF não seja fornecido no DTO, dependendo da sua regra de negócio
      throw new HttpException('CPF is required', 400);
    }

    const existingUser = await this.userRepository.findOne({
      where: { cpf }
    });

    if (existingUser) {
      // Se um usuário com o mesmo CPF já existe, lança uma exceção
      throw new ConflictException('User with this CPF already exists.');
      // Ou, se preferir usar HttpException como antes:
      // throw new HttpException('User with this CPF already exists.', 409); // 409 Conflict
    }

    // 2. Se o CPF não existe, cria e salva o novo usuário
    const hashedPassword = await hashPassword(dto.password)
    const userData = this.userRepository.create({
      ...dto,
      password:hashedPassword
    });
    return this.userRepository.save(userData);
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
}
