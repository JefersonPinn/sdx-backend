import { IsDateString, IsDecimal, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateAnalysisDto {
    @IsDateString({}, { message: 'A data da coleta deve ser uma data válida.' })
    @IsNotEmpty({ message: 'A data da coleta não pode estar vazia.' })
    collectionDate: string;

    @IsString({ message: 'A hora da coleta deve ser um texto.'}) // IsTime() can be too strict depending on format
    @IsNotEmpty({ message: 'A hora da coleta não pode estar vazia.' })
    collectionTime: string;

    @IsString({ message: 'O ponto de coleta deve ser um texto.' })
    @MaxLength(255, { message: 'O ponto de coleta deve ter no máximo 255 caracteres.' })
    @IsNotEmpty({ message: 'O ponto de coleta não pode estar vazio.' })
    collectionPoint: string;

    @IsOptional()
    @IsDecimal({ decimal_digits: '2' }, { message: 'O pH deve ser um número decimal com até 2 casas.' })
    ph?: number;

    @IsOptional()
    @IsDecimal({ decimal_digits: '2' }, { message: 'O DBO deve ser um número decimal com até 2 casas.' })
    dbo?: number;

    @IsOptional()
    @IsDecimal({ decimal_digits: '2' }, { message: 'O DQO deve ser um número decimal com até 2 casas.' })
    dqo?: number;

    @IsOptional()
    @IsDecimal({ decimal_digits: '2' }, { message: 'A turbidez deve ser um número decimal com até 2 casas.' })
    turbidity?: number;

    @IsOptional()
    @IsDecimal({ decimal_digits: '2' }, { message: 'Os sólidos suspensos devem ser um número decimal com até 2 casas.' })
    suspendedSolids?: number;

    @IsOptional()
    @IsUUID('4', { message: 'O ID da análise corrigida deve ser um UUID válido.' })
    correctedFromId?: string;
}
