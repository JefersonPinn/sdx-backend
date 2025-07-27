import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    cpf: string;

    @IsNotEmpty()
    @IsEmail()
    @MaxLength(255)
    email: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    password: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    role: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    status: string;

    @IsNotEmpty()
    @IsString()
    id_tenants: string;
}
