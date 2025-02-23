import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/global/base-response';

export class AuthResponse extends BaseResponse {
  @ApiProperty({ description: 'user avatar' })
  avatar?: string;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'user name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'user email',
  })
  @IsString()
  email: string;

  @ApiProperty({ required: true, description: 'access token' })
  @IsString()
  accessToken?: string;

  @ApiProperty({ required: true, description: 'refresh token' })
  @IsString()
  refreshToken?: string;
}

export class TokensResponse {
  @ApiProperty({ required: true, description: 'access token' })
  @IsString()
  accessToken?: string;

  @ApiProperty({ required: true, description: 'refresh token' })
  @IsString()
  refreshToken?: string;
}
