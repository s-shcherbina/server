import {
  ConflictException,
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
import { UpdateActionDto } from './dto/update-action.dto';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/companies/entities/company.entity';
import { Role } from 'src/common/types';

@Injectable()
export class CompanyActionsService {
  constructor(
    @InjectRepository(CompanyAction)
    private readonly companyActionsRepository: Repository<CompanyAction>,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {}

  public select() {
    return [
      'user.id',
      'user.name',
      'user.avatar',
      'user.email',
      'user.createdAt',
      'user.updatedAt',
      'user.deletedAt',
    ];
  }

  public async findAction(company: Company, user: User) {
    return this.companyActionsRepository
      .createQueryBuilder('company_action')
      .where({ company, user })
      .leftJoinAndSelect('company_action.company', 'company')
      .leftJoin('company_action.user', 'user')
      .addSelect(this.select())
      .getOne();
  }

  public async findActionById(id: string) {
    return this.companyActionsRepository
      .createQueryBuilder('company_action')
      .where({ id })
      .leftJoinAndSelect('company_action.company', 'company')
      .leftJoin('company_action.user', 'user')
      .addSelect(this.select())
      .getOne();
  }

  public async ownerAccess(id: string, email: string) {
    const action = await this.findActionById(id);
    const company = await this.companiesService.findCompanyById(
      action.company.id,
    );
    return company.owner.email !== email;
  }

  public async userAccess(id: string, email: string) {
    const action = await this.findActionById(id);
    return action.user.email !== email;
  }

  public async updateRating(id: string, rating: number) {
    return this.companyActionsRepository.update({ id }, { rating });
  }

  public async createAction(createCompanyActionDto: CreateCompanyActionDto) {
    const existAction = await this.findAction(
      createCompanyActionDto.company,
      createCompanyActionDto.user,
    );
    if (existAction)
      throw new ConflictException(
        `The company ${createCompanyActionDto.company.title} already exists`,
      );

    const action = await this.companyActionsRepository.save({
      ...createCompanyActionDto,
    });
    delete action.user.password;
    return action;
  }

  public async findAllActions() {
    return this.companyActionsRepository
      .createQueryBuilder('company_action')
      .leftJoinAndSelect('company_action.company', 'company')
      .leftJoin('company_action.user', 'user')
      .addSelect(this.select())
      .getMany();
  }

  public async deleteCompanyAction(id: string, email: string) {
    if (await this.ownerAccess(id, email))
      throw new ForbiddenException('Forbidden recource');

    return this.companyActionsRepository.delete({ id });
  }

  public async deleteUserAction(id: string, email: string) {
    if (await this.userAccess(id, email))
      throw new ForbiddenException('Forbidden recource');

    return this.companyActionsRepository.delete({ id });
  }

  public async updateCompanyAction(
    id: string,
    updateActionDto: UpdateActionDto,
    email: string,
  ) {
    if (await this.ownerAccess(id, email))
      throw new ForbiddenException('Forbidden recource');

    if (!(updateActionDto.ownerVerdict && updateActionDto.userVerdict)) {
      updateActionDto.role = Role.fired;
      updateActionDto.rating = 0;
    }

    return this.companyActionsRepository.update({ id }, { ...updateActionDto });
  }

  public async updateUserAction(
    id: string,
    updateActionDto: UpdateActionDto,
    email: string,
  ) {
    if (await this.userAccess(id, email))
      throw new ForbiddenException('Forbidden recource');

    if (!(updateActionDto.ownerVerdict && updateActionDto.userVerdict)) {
      updateActionDto.role = Role.fired;
      updateActionDto.rating = 0;
    }

    return this.companyActionsRepository.update({ id }, { ...updateActionDto });
  }

  public async findInvitations(email: string) {
    const user = await this.usersService.findByEmail(email);
    const actions = await this.companyActionsRepository
      .createQueryBuilder('company_action')
      .where({ user, userVerdict: false, ownerVerdict: true })
      .leftJoinAndSelect('company_action.company', 'company')
      .getMany();

    const invitations = [];

    for (const action of actions) {
      const invitation = await this.companiesService.findCompanyById(
        action.company.id,
      );
      invitations.push(invitation);
    }

    return invitations;
  }

  public async findRequests(email: string) {
    const user = await this.usersService.findByEmail(email);
    const actions = await this.companyActionsRepository
      .createQueryBuilder('company_action')
      .where({ user, userVerdict: true, ownerVerdict: false })
      .leftJoinAndSelect('company_action.company', 'company')
      .getMany();

    const requests = [];

    for (const action of actions) {
      const request = await this.companiesService.findCompanyById(
        action.company.id,
      );
      requests.push(request);
    }

    return requests;
  }

  public async findCandidates(email: string, companyId: string) {
    const company = await this.companiesService.findCompanyById(companyId);
    if (company.owner.email !== email)
      new ForbiddenException('Forbidden recource');

    const actions = await this.companyActionsRepository
      .createQueryBuilder('company_action')
      .where({ company, userVerdict: true, ownerVerdict: false })
      .leftJoinAndSelect('company_action.user', 'user')
      .getMany();

    const candidates = [];

    for (const action of actions) {
      const candidate = await this.usersService.findByEmail(action.user.email);
      delete candidate.password;
      candidates.push(candidate);
    }

    return candidates;
  }

  public async findInvitedUsers(email: string, companyId: string) {
    const company = await this.companiesService.findCompanyById(companyId);
    if (company.owner.email !== email)
      new ForbiddenException('Forbidden recource');

    const actions = await this.companyActionsRepository
      .createQueryBuilder('company_action')
      .where({ company, userVerdict: false, ownerVerdict: true })
      .leftJoinAndSelect('company_action.user', 'user')
      .getMany();

    const candidates = [];

    for (const action of actions) {
      const candidate = await this.usersService.findByEmail(action.user.email);
      delete candidate.password;
      candidates.push(candidate);
    }

    return candidates;
  }

  public async findMembers(email: string, companyId: string) {
    const company = await this.companiesService.findCompanyById(companyId);
    if (company.owner.email !== email)
      new ForbiddenException('Forbidden recource');

    const actions = await this.companyActionsRepository
      .createQueryBuilder('company_action')
      .where({ company, userVerdict: true, ownerVerdict: true })
      .leftJoinAndSelect('company_action.user', 'user')
      .getMany();

    const candidates = [];

    for (const action of actions) {
      const candidate = await this.usersService.findByEmail(action.user.email);
      delete candidate.password;
      candidates.push(candidate);
    }

    return candidates;
  }

  public async updateRole(
    id: string,
    updateRoleDto: UpdateRoleDto,
    email: string,
  ) {
    if (await this.ownerAccess(id, email))
      throw new ForbiddenException('Forbidden recource');

    return this.companyActionsRepository.update({ id }, { ...updateRoleDto });
  }

  public async findOneAction(companyId: string, email: string) {
    const company = await this.companiesService.findCompanyById(companyId);

    const user = await this.usersService.findByEmail(email);

    return this.findAction(company, user);
  }
}
