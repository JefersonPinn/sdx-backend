import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { TenantEntity } from 'src/tenants/entities/tenant.entity';
import { UserTenantEntity } from 'src/relations/entities/user-tenant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TenantEntity, UserTenantEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
