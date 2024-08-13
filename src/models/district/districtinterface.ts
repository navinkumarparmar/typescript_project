import { IsString } from 'class-validator';

export class District {

  @IsString({ message: 'Enter a valid name' })
  name!: string;

  @IsString({ message: 'Enter a valid StateID' })
  StateID!: string;

 
}


