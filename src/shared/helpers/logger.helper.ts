import * as util from 'util';

export class Logger {
  static INFO = (message: string, data: any) => {
    console.log(`${message} : `, util.inspect(data, true, null, false));
  };

  static ERROR = (message: string, data: any) => {
    console.error(`${message} : `, util.inspect(data, true, null, false));
  };
}
