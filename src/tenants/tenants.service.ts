import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TenantEntity } from './entities/tenant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) { }

  async create(createTenantDto: CreateTenantDto): Promise<TenantEntity> {
    const tenantData = await this.tenantRepository.create(createTenantDto);
    return this.tenantRepository.save(tenantData);
  }

  async findAll(): Promise<TenantEntity[]> {
    return await this.tenantRepository.find();
  }

  async findOne(id: string): Promise<TenantEntity> {
    const tenantData = await this.tenantRepository.findOneBy({ id: id });
    if (!tenantData) {
      throw new HttpException(
        'Tenant Not Found',
        404,
      );
    }
    return tenantData;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<TenantEntity> {
    const existingTenant = await this.tenantRepository.findOneBy({ id: id });

    if (!existingTenant) {
      throw new NotFoundException('Tenant Not Found'); // Lança exceção se o tenant não existir
    }

    // Mescla os dados do DTO com o tenant existente
    const tenantData = this.tenantRepository.merge(existingTenant, updateTenantDto);
    
    // Salva as alterações no banco de dados
    return await this.tenantRepository.save(tenantData);
  }

  async remove(id: string): Promise<TenantEntity> {
    const existingTenant = await this.findOne(id);
    return await this.tenantRepository.remove(existingTenant);
  }
}
