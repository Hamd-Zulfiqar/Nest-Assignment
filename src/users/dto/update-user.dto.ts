import { IsString, IsEmail, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDTO {
  @ApiProperty()
  @IsString({message: "First Name should be a string!"})
  readonly firstName: string;

  @ApiProperty()
  @IsString({message: "Last Name should be a string!"})
  readonly lastName: string;

  @ApiProperty({ minLength: 6, maxLength: 10})
  @Length(6,10, {message: "Password must be between 6 and 10 characters"})
  password: string;
}
