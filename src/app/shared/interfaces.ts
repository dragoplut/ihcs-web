export interface IAuthCred {
  timeNow: string;
  password: string;
  username: string;
}
export interface IActiveRoute {
  path: string[];
  pathTitle: string;
  reference?: string;
  referenceTitle?: string;
}
export interface IJsonServiceParam {
  type?: number;
  userName?: string;
  interval?: number;
  name?: string;
  period?: number;
  start_date?: any;
  end_date?: any;
  variable?: any;
}
export interface IJsonServiceVariableUpdate {
  enabled?: boolean;
  gain?: number;
  method?: number;
  name?: string;
  offset?: number;
  period?: number;
}
export interface IJsonServicesPayload {
  id: number;
  jsonrpc: string;
  method: string;
  params: IJsonServiceParam[];
}
