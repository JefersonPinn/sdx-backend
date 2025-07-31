import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus, ForbiddenException, Get, Param, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ajuste o caminho se necessário
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Analysis } from './entities/analysis.entity';
import { RequestWithUser } from 'src/auth/request-with-user.interface';

@ApiTags('Análises')
@ApiBearerAuth() // Informa ao Swagger que essa rota precisa de token
@UseGuards(JwtAuthGuard) // Protege todas as rotas deste controller
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createAnalysisDto: CreateAnalysisDto,
    @Req() req: RequestWithUser): Promise<Analysis> {
    // O objeto `req.user` é populado pelo JwtAuthGuard a partir do payload do token.
    // O erro "Usuário ou Tenant não encontrado no token JWT" indica que `req.user.sub`
    // ou `req.user.tenantId` não estão sendo encontrados.
    //
    // Verifique os dois locais principais:
    // 1. AuthService (login): O objeto `payload` usado para criar o token com `jwtService.sign(payload)`
    //    DEVE conter as chaves `sub` (com o id do usuário) e `tenantId`.
    // 2. JwtStrategy (validate): O método `validate(payload)` DEVE retornar um objeto que
    //    contenha as chaves `sub` e `tenantId`. O mais comum é retornar o próprio `payload`.

    const userId = req.user.sub; // 'sub' é o ID do usuário no payload
    const tenantId = req.user.tenantId;

    if (!userId || !tenantId) {
      // Lançar uma exceção mais apropriada do NestJS.
      // Adicionar um log pode ajudar a depurar o que está em `req.user`.
      console.error('Conteúdo de req.user que causou o erro:', req.user);
      throw new ForbiddenException('Informações de usuário ou tenant ausentes no token.');
    }

    return this.analysisService.create(createAnalysisDto, userId, tenantId);
  }

  @Get()
  @ApiOkResponse({ description: 'Lista de análises retornada com sucesso.' })
  findAll(@Req() req: RequestWithUser): Promise<Analysis[]> {
    // Passamos o objeto de usuário inteiro para o serviço,
    // que conterá a lógica de permissão.
    return this.analysisService.findAll(req.user);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Análise encontrada com sucesso.' })
  @ApiNotFoundResponse({ description: 'Análise não encontrada.' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ): Promise<Analysis> {
    // O serviço também validará se o usuário tem permissão para ver esta análise.
    return this.analysisService.findOne(id, req.user);
  }
}
