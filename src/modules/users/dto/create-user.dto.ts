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
  @ApiProperty()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiPropertyOptional({ minimum: 0, maximum: 150 })
  @IsOptional()
  @IsInt({ message: 'Age must be an integer' })
  @Min(0, { message: 'Age cannot be negative' })
  @Max(150, { message: 'Age cannot be greater than 150' })
  age?: number;
}
