import { UserTenantEntity } from "src/relations/entities/user-tenant.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tenants')
export class TenantEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    cnpj!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    slug!: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    subscription_plan!: string | null;

    @Column({ type: 'varchar', length: 50, nullable: false, default: 'enabled' })
    status!: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at!: Date;

    // Adicione a relação OneToMany com a nova tabela de junção
    @OneToMany(() => UserTenantEntity, userTenant => userTenant.tenant)
    userTenants!: UserTenantEntity[];
}
