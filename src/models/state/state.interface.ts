import { IsString } from 'class-validator';

export class State {

  @IsString({ message: 'Enter a valid name' })
  name!: string;

 
}

