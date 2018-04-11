import { IActiveRoute } from '../interfaces';

export default class ActiveRoute implements IActiveRoute {
  public path: string[];
  public pathTitle: string;
  public reference?: string;
  public referenceTitle?: string;
}
