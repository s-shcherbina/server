import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CompanyActionsService } from './company-actions.service';
import { CreateCompanyActionDto } from './dto/create-company-action.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { CompanyAction } from './entities/company-actions.entity';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';

@ApiTags('actions')
@UseGuards(AuthGuard(['auth0', 'jwt']))
@Controller('actions')
export class CompanyActionsController {
  constructor(private readonly companyActionsService: CompanyActionsService) {}

  @ApiOperation({ description: 'creating a company action' })
  @ApiBody({
    schema: {
      example: {
        userVerdict: true,
        ownerCompanyVerdict: false,
        company: { type: Company },
        user: { type: User },
      },
    },
  })
  @ApiOkResponse({ type: PartialType(CompanyAction) })
  @Post()
  async createAction(@Body() createCompanyActionDto: CreateCompanyActionDto) {
    return this.companyActionsService.createAction(createCompanyActionDto);
  }

  @ApiOperation({ description: 'getting all actions' })
  @ApiOkResponse({ type: [PartialType(CompanyAction)] })
  @Get()
  async findAllActions() {
    return this.companyActionsService.findAllActions();
  }

  @ApiOperation({ description: 'deleting owner company action' })
  @Delete('company/:id')
  async deleteCompanyAction(
    @Param('id') id: string,
    @CurrentUser('email') email: string,
  ) {
    return this.companyActionsService.deleteCompanyAction(id, email);
  }

  @ApiOperation({ description: 'deleting user action' })
  @Delete('user/:id')
  async userAction(
    @Param('id') id: string,
    @CurrentUser('email') email: string,
  ) {
    return this.companyActionsService.deleteUserAction(id, email);
  }

  @ApiOperation({ description: 'updating owner company action' })
  @ApiBody({
    schema: {
      example: {
        userVerdict: true,
        ownerCompanyVerdict: false,
      },
    },
  })
  @ApiOkResponse({ type: PartialType(CompanyAction) })
  @Patch('company/:id')
  async updateCompanyAction(
    @Param('id') id: string,
    @Body() updateActionDto: UpdateActionDto,
    @CurrentUser('email') email: string,
  ) {
    return this.companyActionsService.updateCompanyAction(
      id,
      updateActionDto,
      email,
    );
  }

  @ApiOperation({ description: 'updating user action' })
  @ApiBody({
    schema: {
      example: {
        userVerdict: true,
        ownerCompanyVerdict: false,
      },
    },
  })
  @ApiOkResponse({ type: PartialType(CompanyAction) })
  @Patch('user/:id')
  async updateUserAction(
    @Param('id') id: string,
    @Body() updateActionDto: UpdateActionDto,
    @CurrentUser('email') email: string,
  ) {
    return this.companyActionsService.updateUserAction(
      id,
      updateActionDto,
      email,
    );
  }

  @ApiOperation({ description: 'getting invitations from company' })
  @ApiOkResponse({ type: [PartialType(CompanyAction)] })
  @Get('/users/invitations')
  async findInvitations(@CurrentUser('email') email: string) {
    return this.companyActionsService.findInvitations(email);
  }

  @ApiOperation({ description: 'getting requests to join company' })
  @ApiOkResponse({ type: [PartialType(CompanyAction)] })
  @Get('/users/requests')
  async findRequests(@CurrentUser('email') email: string) {
    return this.companyActionsService.findRequests(email);
  }

  @ApiOperation({ description: 'getting invited users' })
  @ApiOkResponse({ type: [PartialType(CompanyAction)] })
  @Get('invited/:companyId')
  async findInvitedUsers(
    @Param('companyId') companyId: string,
    @CurrentUser('email') email: string,
  ) {
    return this.companyActionsService.findInvitedUsers(email, companyId);
  }

  @ApiOperation({ description: 'getting candidates to join company' })
  @ApiOkResponse({ type: [PartialType(CompanyAction)] })
  @Get('candidates/:companyId')
  async findCandidates(
    @Param('companyId') companyId: string,
    @CurrentUser('email') email: string,
  ) {
    return this.companyActionsService.findCandidates(email, companyId);
  }

  @ApiOperation({ description: 'getting company members' })
  @ApiOkResponse({ type: [PartialType(CompanyAction)] })
  @Get('members/:companyId')
  async findMembers(
    @Param('companyId') companyId: string,
    @CurrentUser('email') email: string,
  ) {
    return this.companyActionsService.findMembers(email, companyId);
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
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @CurrentUser('email') email: string,
  ) {
    return this.companyActionsService.updateRole(id, updateRoleDto, email);
  }

  @ApiOperation({
    description: 'getting one action by companyId and user email',
  })
  @ApiOkResponse({ type: [PartialType(CompanyAction)] })
  @Get('/company_user/:companyId')
  async findOneAction(
    @Param('companyId') companyId: string,
    @CurrentUser('email') email: string,
  ) {
    return this.companyActionsService.findOneAction(companyId, email);
  }
}
