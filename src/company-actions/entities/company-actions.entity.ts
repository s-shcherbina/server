import { Base } from 'src/common/global/base-entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Role } from 'src/common/types';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'company_actions' })
export class CompanyAction extends Base {
  @ApiProperty({
    required: true,
    nullable: false,
    description: 'owner verdict',
  })
  @Column({ nullable: false })
  ownerCompanyVerdict: boolean;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'user verdict',
  })
  @Column({ nullable: false })
  userVerdict: boolean;

  @ManyToOne(() => User, (user) => user.companyActions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Company, (company) => company.companyActions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'user role in the company',
  })
  @Column({ nullable: true, default: Role.MEMBER })
  role?: Role;
}
