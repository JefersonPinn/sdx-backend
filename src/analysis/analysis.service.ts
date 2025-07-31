import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { Analysis } from './entities/analysis.entity';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Analysis)
    private analysisRepository: Repository<Analysis>,
  ) {}

  async create(
    createAnalysisDto: CreateAnalysisDto,
    userId: string,
    tenantId: string,
  ): Promise<Analysis> {
    const analysisToSave = this.analysisRepository.create({
      ...createAnalysisDto, // Pega todos os dados do formulário (DTO)
      userId: userId,       // Adiciona o ID do usuário logado (do JWT)
      tenantId: tenantId,   // Adiciona o ID do tenant (do JWT)
    });

    return this.analysisRepository.save(analysisToSave);
  }

  // ... seus outros métodos (findAll, findOne, softDelete, etc.)
}

