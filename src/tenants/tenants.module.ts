import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { TenantEntity } from './entities/tenant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([TenantEntity]),
  ],
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule { }
