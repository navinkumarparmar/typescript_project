import { IsString } from 'class-validator';

export class Shop {
  @IsString({ message: 'Enter a valid name' })
  name!: string;
}
