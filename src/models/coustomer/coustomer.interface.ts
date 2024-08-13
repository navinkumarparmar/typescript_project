import { IsString } from 'class-validator';

export class Coustomer {

//   @IsString({ message: 'Enter a valid Userid ID' })
//   UserID!: string;

  @IsString({ message: 'Enter a valid  product ID' })
  ProductID!: string;

 
}


