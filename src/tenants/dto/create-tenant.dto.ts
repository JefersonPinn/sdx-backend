import { IsNotEmpty, IsString, MaxLength } from "class-validator";


export class CreateTenantDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    slug: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    subscription_plan: string;

    @IsString()
    @MaxLength(50)
    status: string;
}
