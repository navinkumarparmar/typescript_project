import { error } from 'console';
import HttpException from './HttpException';


class WrongAuthenticationTokenException extends HttpException {
    constructor(message: string) {
      super(401, message);
    }
  }

export default WrongAuthenticationTokenException;
