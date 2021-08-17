import { IsString, IsEmail, Length } from "class-validator";
export class CreatePostDTO {
  @IsString({message: "Title should be a string!"})
  readonly title: string;

  @IsString({message: "Body should be a string!"})
  readonly body: string;
}
