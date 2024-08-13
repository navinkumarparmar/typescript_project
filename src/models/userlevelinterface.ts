import { IsString } from 'class-validator';

export class UserLevel {

  @IsString({ message: 'Enter a valid name' })
  name!: string;

 
}
