import { IsString, IsEmail, Length } from "class-validator";
export class UpdateUserDTO {
  @IsString({message: "First Name should be a string!"})
  readonly firstName: string;

  @IsString({message: "Last Name should be a string!"})
  readonly lastName: string;

  @Length(6,10, {message: "Password must be between 6 and 10 characters"})
  password: string;
}
