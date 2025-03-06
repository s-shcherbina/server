import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateCompanyActionDto } from './dto/create-company-action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyAction } from './entities/company-actions.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CompaniesService } from 'src/companies/companies.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateUserActionDto } from './dto/create-user-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class CompanyActionsService {
  constructor(
    @InjectRepository(CompanyAction)
    private readonly companyActionsRepository: Repository<CompanyAction>,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {}

  public async findUserCompanyRole(user: User, company: Company) {
    const userCompany = await this.companyActionsRepository.findOne({
      where: { company, user },
    });
    return userCompany?.role;
  }

  public async userAction(email: string) {
    const user = await this.usersService.findByEmail(email);
    return this.companyActionsRepository.findOne({
      where: { user },
    });
  }

  public async companyAction(email: string) {
    const owner = await this.usersService.findByEmail(email);
    const company = await this.companiesService.findCompanyByOwner(owner);
    return this.companyActionsRepository.findOne({
      where: { company },
    });
  }

  private async removeAction(id: string) {
    const updated = await this.companyActionsRepository.findOneBy({ id });
    if (!updated.ownerCompanyVerdict && !updated.userVerdict)
      this.companyActionsRepository.delete({ id });
  }

  public async createCompanyAction(
    createCompanyActionDto: CreateCompanyActionDto,
    email: string,
  ) {
    if (!this.companyAction(email)) throw new BadRequestException('');

    const userAction = await this.userAction(email);
    if (userAction.userVerdict) throw new BadRequestException('');

    return this.companyActionsRepository.save({ ...createCompanyActionDto });
  }

  public async createUserAction(
    createUserActionDto: CreateUserActionDto,
    email: string,
  ) {
    if (!this.userAction(email)) throw new BadRequestException('');

    const companyAction = await this.companyAction(email);
    if (companyAction?.ownerCompanyVerdict) throw new BadRequestException('');

    return this.companyActionsRepository.save({ ...createUserActionDto });
  }

  public async updateAction(
    id: string,
    updateActionDto: UpdateActionDto,
    email: string,
  ) {
    const companyAction = await this.companyAction(email);
    const userAction = await this.userAction(email);

    if (id !== companyAction?.id || id !== userAction?.id)
      new ForbiddenException('forbiden resours');

    await this.companyActionsRepository.update({ id }, { ...updateActionDto });
    await this.removeAction(companyAction.id);
    return 'success';
  }

  public async findApplicants(email: string) {
    if (!this.companyAction(email))
      throw new ForbiddenException('forbiden resours');

    return this.companyActionsRepository.find({
      where: { userVerdict: true, ownerCompanyVerdict: false },
    });
  }

  public async findInvitations(email: string) {
    if (!this.companyAction(email))
      throw new ForbiddenException('forbiden resours');

    return this.companyActionsRepository.find({
      where: { userVerdict: false, ownerCompanyVerdict: true },
    });
  }

  public async findMembers(email: string) {
    if (!this.companyAction(email))
      throw new ForbiddenException('forbiden resours');

    return this.companyActionsRepository.find({
      where: { userVerdict: true, ownerCompanyVerdict: true },
    });
  }

  public async findApplcations(email: string) {
    if (!this.userAction(email))
      throw new ForbiddenException('forbiden resours');

    return this.companyActionsRepository.find({
      where: { userVerdict: true, ownerCompanyVerdict: false },
    });
  }

  public async findInvitors(email: string) {
    if (!this.userAction(email))
      throw new ForbiddenException('forbiden resours');

    return this.companyActionsRepository.find({
      where: { userVerdict: false, ownerCompanyVerdict: true },
    });
  }

  public async updateRole(
    id: string,
    updateRoleDto: UpdateRoleDto,
    email: string,
  ) {
    if (!this.companyAction(email))
      throw new ForbiddenException('forbiden resours');

    return this.companyActionsRepository.update({ id }, { ...updateRoleDto });
  }
}
