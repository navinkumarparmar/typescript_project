import { IsString, IsEmail } from 'class-validator';

export class User {
  @IsString({ message: 'Enter a valid name' })
  name!: string;

  @IsEmail({}, { message: 'Enter a valid email' })
  email!: string;

  @IsString({ message: 'Enter a valid gender' })
  gender!: string;

  @IsString({ message: 'Enter a valid password' })
  password!: string;
}
