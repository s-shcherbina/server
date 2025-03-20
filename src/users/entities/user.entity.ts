import { ApiProperty } from '@nestjs/swagger';
import { Auth } from 'src/auth/entities/auth.entity';
import { Base } from 'src/common/global/base-entity';
import { Company } from 'src/companies/entities/company.entity';
import { CompanyAction } from 'src/company-actions/entities/company-actions.entity';
import { QuizResult } from 'src/quiz-results/entities/quiz-result.entity';
import { Column, Entity, ManyToMany, OneToMany, OneToOne } from 'typeorm';

@Entity({ name: 'users' })
export class User extends Base {
  @ApiProperty({
    required: false,
    description: 'user avatar',
  })
  @Column({ nullable: true, default: '' })
  avatar?: string;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'user name',
  })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'user email',
  })
  @Column({ nullable: false, unique: true })
  email: string;

  @ApiProperty({
    required: true,
    nullable: true,
    description: 'user password',
  })
  @Column({ nullable: true })
  password: string | null;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'user rating',
  })
  @Column({ nullable: false, default: 0, type: 'float' })
  rating: number;

  @ApiProperty({
    required: true,
    nullable: true,
    type: () => Auth,
    description: 'user refreshtoken',
  })
  @OneToOne(() => Auth, (token) => token.user)
  token: Auth;

  @ManyToMany(() => Company, (company) => company.users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  companies?: Company[];

  @OneToMany(() => CompanyAction, (companyAction) => companyAction.user)
  companyActions: CompanyAction[];

  @OneToMany(() => QuizResult, (quizResult) => quizResult.user)
  quizResults: QuizResult[];
}
