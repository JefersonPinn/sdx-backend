import { TenantEntity } from "src/tenants/entities/tenant.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('analysis')
export class Analysis {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({type: 'uuid'})
    tenantId: string;

    @Column({type: 'uuid'})
    userId: string;

    @Column({ type: 'date', name: 'collection_date' })
    collectionDate: string;

    @Column({ type: 'time', name: 'collection_time' })
    collectionTime: string;

    @Column({ type: 'varchar', length: 255, name: 'collection_point' })
    collectionPoint: string;

    @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
    ph: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    dbo: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    dqo: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    turbidity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    suspendedSolids: number;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity[];

    @ManyToOne(() => TenantEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id' })
    tenant: TenantEntity[];
}
