import { TenantEntity } from "src/tenants/entities/tenant.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('user-tenants')
export class UserTenantEntity {
    @PrimaryColumn({type: 'uuid'})
    user_id!: string;

    @PrimaryColumn({type: 'uuid'})
    tenant_id!: string;

    @ManyToOne(() => UserEntity, user => user.userTenants, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' }) // Define a coluna de junção no banco de dados
    user!: UserEntity;

    @ManyToOne(() => TenantEntity, tenant => tenant.userTenants, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenantId' }) // Define a coluna de junção no banco de dados
    tenant!: TenantEntity;

    @Column({type: 'boolean', default: true})
    status: boolean
}