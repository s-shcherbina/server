import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CompaniesService } from './companies.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { Company } from './entities/company.entity';

@ApiTags('companies')
@UseGuards(AuthGuard(['auth0', 'jwt']))
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ApiOperation({ description: 'creating a company' })
  @ApiBody({
    schema: {
      example: {
        title: 'Company',
        description: 'Our company is the best',
        visibility: true,
      },
    },
  })
  @ApiOkResponse({ type: PartialType(Company) })
  @Post()
  async createOne(
    @Body() createCompanyDto: CreateCompanyDto,
    @CurrentUser('email') email: string,
  ) {
    return this.companiesService.createOne(createCompanyDto, email);
  }

  @ApiOperation({ description: 'getting all companies' })
  @ApiOkResponse({ type: [PartialType(Company)] })
  @Get()
  async findAll() {
    return this.companiesService.findAll();
  }

  @ApiOperation({ description: 'getting user companies' })
  @ApiOkResponse({ type: [PartialType(Company)] })
  @Get('my')
  async findMyCompanies(@CurrentUser('email') email: string) {
    return this.companiesService.findMyCompanies(email);
  }

  @ApiOperation({ description: 'getting one company' })
  @ApiOkResponse({ type: PartialType(Company) })
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser('email') email: string) {
    return this.companiesService.findOne(id, email);
  }

  @ApiOperation({ description: 'company update' })
  @ApiBody({
    schema: {
      example: {
        title: 'Company',
        description: 'Our company is the best',
        visibility: true,
      },
    },
  })
  @ApiOkResponse({ type: PartialType(Company) })
  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @CurrentUser('email') userId: string,
  ) {
    return this.companiesService.updateOne(id, updateCompanyDto, userId);
  }

  @ApiOperation({ description: 'deleting a company' })
  @Delete(':id')
  async removeOne(
    @Param('id') id: string,
    @CurrentUser('email') email: string,
  ) {
    return this.companiesService.removeOne(id, email);
  }
}
