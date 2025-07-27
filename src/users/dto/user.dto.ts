import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserDTO {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    cpf: string;

    @Expose()
    email: string;

    @Expose()
    role: string;

    @Expose()
    status: string;

    @Expose()
    id_tenants: string;
}