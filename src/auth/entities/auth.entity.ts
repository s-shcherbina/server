import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from '../../common/global/base-entity';

@Entity({ name: 'auth' })
export class Auth extends Base {
  @ApiProperty({
    required: true,
    nullable: false,
    description: 'refreshtoken',
  })
  @Column({ name: 'refresh_token', nullable: false })
  refreshToken: string;

  @ApiProperty({
    required: true,
    nullable: true,
    type: () => Auth,
    description: 'user refreshtoken',
  })
  @OneToOne(() => User, (user) => user.token, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
