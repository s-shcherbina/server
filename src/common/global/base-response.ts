import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty({ required: true, nullable: false, description: 'id' })
  id: string;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'created date ',
  })
  createdAt: Date;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'updated date ',
  })
  updatedAt: Date;

  @ApiProperty({
    required: true,
    description: 'deleted date ',
  })
  deletedAt?: Date;
}
