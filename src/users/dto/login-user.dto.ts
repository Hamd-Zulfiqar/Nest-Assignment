import { IsEmail, Length } from "class-validator";
export class LoginUserDTO {
  @IsEmail()
  readonly email: string;

  @Length(6,10, {message: "Password must be between 6 and 10 characters"})
  readonly password: string;
}
