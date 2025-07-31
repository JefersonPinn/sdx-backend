import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class loginDTO {
  @IsString()
  @IsNotEmpty({ message: 'O campo de login (CPF ou email) não pode estar vazio.' })
  login: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'O identificador da empresa não pode estar vazio.' })
  tenantSlug: string;
}
