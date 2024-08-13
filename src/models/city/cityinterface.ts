import { IsString } from 'class-validator';

export class City {

  @IsString({ message: 'Enter a valid name' })
  name!: string;

  @IsString({ message: 'Enter a valid StateID' })
  DistrictID!: string;

 
}
