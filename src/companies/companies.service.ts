import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly usersService: UsersService,
  ) {}

  private select() {
    return [
      'owner.id',
      'owner.name',
      'owner.avatar',
      'owner.email',
      'owner.createdAt',
      'owner.updatedAt',
      'owner.deletedAt',
    ];
  }

  public async findCompanyById(id: string) {
    return this.companyRepository
      .createQueryBuilder('company')
      .where({ id })
      .leftJoin('company.owner', 'owner')
      .select('company')
      .addSelect(this.select())
      .getOne();
  }

  // public async findCompanyByOwner(owner: User) {
  //   return this.companyRepository.findOne({ where: { owner } });
  // }

  public async checkAccess(id: string, email: string) {
    const company = await this.findCompanyById(id);
    const user = await this.usersService.findByEmail(email);
    return user.id === company.owner.id;
  }

  public async createOne(createCompanyDto: CreateCompanyDto, email: string) {
    const existCompany = await this.companyRepository.findOneBy({
      title: createCompanyDto.title,
    });

    if (existCompany)
      throw new ConflictException(`${createCompanyDto.title} already exists`);

    const owner = await this.usersService.findByEmail(email);

    const company = await this.companyRepository.save({
      ...createCompanyDto,
      owner,
    });
    delete company.owner.password;
    return company;
  }

  public async findAll() {
    return this.companyRepository
      .createQueryBuilder('company')
      .where({ visibility: true })
      .leftJoin('company.owner', 'owner')
      .select('company')
      .addSelect(this.select())
      .orderBy('company.created_at', 'DESC')
      .getMany();
  }

  public async findMyCompanies(email: string) {
    const owner = await this.usersService.findByEmail(email);
    return this.companyRepository
      .createQueryBuilder('company')
      .where({ owner })
      .leftJoin('company.owner', 'owner')
      .select('company')
      .addSelect(this.select())
      .orderBy('company.created_at', 'DESC')
      .getMany();
  }

  public async findOne(id: string, email: string) {
    const company = await this.findCompanyById(id);
    const user = await this.usersService.findByEmail(email);

    if (user.id !== company.owner.id && !company.visibility)
      throw new ForbiddenException('forbiden resours');

    return company;
  }

  public async updateOne(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    email: string,
  ) {
    if (!this.checkAccess(id, email))
      throw new ForbiddenException('forbiden resours');
    if (updateCompanyDto.title) {
      const existCompany = await this.companyRepository.findOneBy({
        title: updateCompanyDto.title,
      });

      if (existCompany && existCompany.id !== id)
        throw new ConflictException(`${updateCompanyDto.title} already exists`);
    }
    return this.companyRepository.update({ id }, { ...updateCompanyDto });
  }

  public async removeOne(id: string, email: string) {
    if (!this.checkAccess(id, email))
      throw new ForbiddenException('forbiden resours');
    return this.companyRepository.delete({ id });
  }
}
