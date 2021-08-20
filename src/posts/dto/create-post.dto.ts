import { IsString, IsEmail, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class CreatePostDTO {
  @ApiProperty()
  @IsString({message: "Title should be a string!"})
  readonly title: string;

  @ApiProperty()
  @IsString({message: "Body should be a string!"})
  readonly body: string;
}
