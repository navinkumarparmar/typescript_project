import { IsString } from 'class-validator';

export class Product {
  @IsString({ message: 'Enter a valid name' })
  name!: string;
}
