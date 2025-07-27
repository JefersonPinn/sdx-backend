import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) { }

  @Post()
  async create(@Body() createTenantDto: CreateTenantDto) {
    try {
      const data = await this.tenantsService.create(createTenantDto);
      return {
        success: true,
        message: 'Tenant Created Successfully',
        data
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get()
  async findAll() {
    try {
      const data = await this.tenantsService.findAll();
      return {
        success: true,
        message: 'Tenants Fetched Successfully',
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.tenantsService.findOne(
        id,
      );
      return {
        success: true,
        data,
        message: 'Tenant Fetched Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }


  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() UpdateTenantDto: UpdateTenantDto,
  ) {
    try {
      await this.tenantsService.update(
        id,
        UpdateTenantDto,
      );
      return {
        success: true,
        message: 'Tenant Updated Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.tenantsService.remove(id);
      return {
        success: true,
        message: 'Tenant Deleted Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
