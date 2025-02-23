import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export abstract class Base {
  @ApiProperty({ required: true, nullable: false, description: 'id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'created date ',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'updated date ',
  })
  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    required: true,
    nullable: true,
    description: 'deleted date ',
  })
  @CreateDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
