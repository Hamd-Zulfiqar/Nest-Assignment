import { IsEmail, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class LoginUserDTO {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ minLength: 6, maxLength: 10})
  @Length(6,10, {message: "Password must be between 6 and 10 characters"})
  readonly password: string;
}
