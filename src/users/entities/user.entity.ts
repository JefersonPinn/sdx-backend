import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserTenantEntity } from "src/relations/entities/user-tenant.entity";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    cpf!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password!: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    role!: string | null;

    @Column({ type: 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    last_login!: Date | null;

    @Column({ type: 'varchar', length: 50, nullable: true, default: 'enabled' })
    status!: string | null;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at!: Date;

    @Column({ type: 'uuid', nullable: true })
    id_tenants!: string | null; // Coluna para a chave estrangeira

    // Adicione a relação OneToMany com a nova tabela de junção
    @OneToMany(() => UserTenantEntity, userTenant => userTenant.user)
    userTenants!: UserTenantEntity[];
}
