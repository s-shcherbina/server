import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CompanyActionsService } from './company-actions.service';
import { CreateCompanyActionDto } from './dto/create-company-action.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateUserActionDto } from './dto/create-user-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { CompanyAction } from './entities/company-actions.entity';

@ApiTags('actions')
@UseGuards(AuthGuard(['auth0', 'jwt']))
@Controller('actions')
export class CompanyActionsController {
  constructor(private readonly companyActionsService: CompanyActionsService) {}

  @ApiOperation({ description: 'creating invitation' })
  @ApiBody({
    schema: {
      example: {
        ownerCompanyVerdict: true,
      },
    },
  })
  @ApiOkResponse({ type: PartialType(CompanyAction) })
  @Post('company')
  async createCompanyAction(
    @Body() createCompanyActionDto: CreateCompanyActionDto,
    @CurrentUser('email') email: string,
  ) {
    return this.companyActionsService.createCompanyAction(
      createCompanyActionDto,
      email,
    );
  }

  @ApiOperation({ description: 'creating invitation' })
  @ApiBody({
    schema: {
      example: {
        userVerdict: true,
      },
    },
  })
  @ApiOkResponse({ type: PartialType(CompanyAction) })
  @Post('user')
  async createUserAction(
    @Body() createUserActionDto: CreateUserActionDto,
    @CurrentUser('email') email: string,
  ) {
    return this.companyActionsService.createUserAction(
      createUserActionDto,
      email,
    );
  }

  @ApiOperation({ description: 'updating action' })
  @ApiBody({
    schema: {
      example: {
        userVerdict: true,
        ownerCompanyVerdict: false,
      },
    },
  })
  @ApiOkResponse({ type: PartialType(CompanyAction) })
  @Patch(':id')
  async updateAction(
    @Param('id') id: string,
    @Body() updateActionDto: UpdateActionDto,
    @CurrentUser('email') email: string,
  ) {
    return this.companyActionsService.updateAction(id, updateActionDto, email);
  }

  @ApiOperation({ description: 'getting invitations' })
  @ApiOkResponse({ type: PartialType(CompanyAction) })
  @Get('user/invitations')
  async findInvitations(@CurrentUser('email') email: string) {
    return this.companyActionsService.findInvitations(email);
  }

  @ApiOperation({ description: 'getting applicants' })
  @ApiOkResponse({ type: PartialType(CompanyAction) })
  @Get('user/applicants')
  async findApplicants(@CurrentUser('email') email: string) {
    return this.companyActionsService.findApplicants(email);
  }

  @ApiOperation({ description: 'getting invitors' })
  @ApiOkResponse({ type: PartialType(CompanyAction) })
  @Get('company/invitors')
  async findInvitors(@CurrentUser('email') email: string) {
    return this.companyActionsService.findInvitors(email);
  }

  @ApiOperation({ description: 'getting applications' })
  @ApiOkResponse({ type: PartialType(CompanyAction) })
  @Get('company/applications')
  async findApplcations(@CurrentUser('email') email: string) {
    return this.companyActionsService.findApplcations(email);
  }

  @ApiOperation({ description: 'getting members' })
  @ApiOkResponse({ type: PartialType(CompanyAction) })
  @Get('company/members')
  async findMembers(@CurrentUser('email') email: string) {
    return this.companyActionsService.findMembers(email);
  }

  @ApiOperation({ description: 'updating role' })
  @ApiBody({
    schema: {
      example: {
        role: 500,
      },
    },
  })
  @ApiOkResponse({ type: PartialType(CompanyAction) })
  @Patch('company/role/:id')
  updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @CurrentUser('email') email: string,
  ) {
    return this.companyActionsService.updateRole(id, updateRoleDto, email);
  }
}
