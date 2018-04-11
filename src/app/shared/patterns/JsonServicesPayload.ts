import { IJsonServicesPayload, IJsonServiceParam } from '../interfaces';

export default class JsonServicesPayload implements IJsonServicesPayload {
  public id: number = 0;
  public jsonrpc: string = '2.0';
  public method: string;
  public params: IJsonServiceParam[] = [{}];
}
