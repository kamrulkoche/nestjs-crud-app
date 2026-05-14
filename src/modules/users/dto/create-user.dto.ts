import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Rahim' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'rahim@test.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 25, minimum: 0, maximum: 150 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  age?: number;
}
