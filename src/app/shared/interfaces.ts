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
}
export interface IJsonServicesPayload {
  id: number;
  jsonrpc: string;
  method: string;
  params: IJsonServiceParam[];
}
