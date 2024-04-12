import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { Logger } from './logger.helper';
export default class SsmHelper {
  ssm: SSMClient;

  constructor() {
    this.ssm = new SSMClient({
      region: process.env.REGION || 'ap-southeast-2'
    });
  }

  async getParams(paramName: string): Promise<any> {
    try {
      const params = {
        Name: paramName,
        WithDecryption: true
      };
      const cmd = new GetParameterCommand(params);
      const data = await this.ssm.send(cmd);
      return {
        [`${paramName}`]: data?.Parameter?.Value
      };
    } catch (error) {
      Logger.INFO('Error getting SSM params', error);
    }
  }
}
