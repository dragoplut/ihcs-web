import {
  Component,
  OnInit
} from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { VARIABLES_MOCK } from '../../shared/constants';
import { JsonServicesPayload, ActiveRoute } from '../../shared/patterns';
import { JsonService } from '../../services/';
import { AppState } from '../../app.service';
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';

@Component({
  selector: 'variables',  // <settings></settings>
  styleUrls: [ './variables.component.scss' ],
  templateUrl: './variables.component.html'
})
export class VariablesComponent implements OnInit {
  /**
   * Set our default values
   */
  public variables: any = new MatTableDataSource<Element>([]);
  public canEdit: boolean = false;
  public loading: boolean = false;
  /**
   * TypeScript public modifiers
   */
  constructor(
    public state: AppState,
    public json: JsonService
  ) {}

  public ngOnInit() {
    const activeRoute: ActiveRoute = this.state.get('activeRoute');
    this.canEdit = activeRoute.path[0] === '/variables';
    this.requestProductsAndVars();
  }

  public populateVariables(searchValue?: string, resp?: any) {
    let varsAll: any[] = [];
    const products: any = this.state.get('products');
    const varsLogged: any[] = this.state.get('requestVarsLogged');
    if (products && products.identifiers && products.identifiers.length) {
      products.identifiers.forEach((identifier: string) => {
        varsAll = varsAll.concat(this.state.get(`${identifier}.requestVars`) || []);
      });
    }
    const unfilteredItems: any[] = [];
    const variablesData: any = varsAll && varsAll.length ? varsAll : [];
    if (variablesData && variablesData.length) {
      variablesData.forEach((item: any, idx: number) => {
        const position: number = idx + 1;
        item.checked = false;
        item.groupName = 'Group_' + position;
        if (item && item.value) {
          item.value = item.value.uValue || item.value.sValue || item.value.bValue;
        }
        if (varsLogged && varsLogged.length) {
          varsLogged.forEach((varLogged: any) => {
            if (item.name === varLogged.name) {
              for (const propName in varLogged) {
                if (propName) {
                  item[propName] = varLogged[propName];
                }
              }
            }
          });
        }
        unfilteredItems.push(item);
      });
    }
    this.variables.data = this.searchByString(unfilteredItems, searchValue || '');
    this.loading = false;
  }

  public getAppList(callback?: any, reject?: any) {
    const payload: JsonServicesPayload = new JsonServicesPayload();
    payload.method = 'appmanager.appList';
    this.json.requestByPayload(payload).subscribe(
      (resp: any) => {
        const products: any = { identifiers: [], apps: {} };
        if (_.hasIn(resp, 'result.appInfo') && resp.result.appInfo.length) {
          resp.result.appInfo.forEach((item: any) => {
            if (_.hasIn(item, 'id.name')
              && products.identifiers.indexOf(item.id.productNr) === -1) {
              products.identifiers.push(item.id.productNr);
              if (item.id.name === 'VarServer') {
                this.state.set('VarServer', item.id.productNr);
              }
            }
            if (products.identifiers && products.identifiers.length) {
              products.identifiers.forEach((productId: string) => {
                if (products.apps[productId]) {
                  products.apps[productId].push(item);
                } else {
                  products.apps[productId] = [ item ];
                }
              });
            }
          });
        }
        this.state.set('products', products);
        if (callback) { callback(resp); }
      },
      (err: any) => {
        if (reject) { reject(err); }
      }
    );
  }

  public getVariables(productIdentifier: string, callback?: any, reject?: any) {
    const payload: JsonServicesPayload = new JsonServicesPayload();
    payload.method = `${productIdentifier}.varmanager.requestVars`;
    this.json.requestByPayload(payload).subscribe(
      (resp: any) => {
        if (_.hasIn(resp, 'result.var')) {
          this.state.set(`${productIdentifier}.requestVars`, resp.result.var);
        }
        setTimeout(() => {
          if (callback) { callback(resp); }
        }, 200);
      },
      (err: any) => {
        if (reject) { reject(err); }
      }
    );
  }

  public getVariablesLogged(callback?: any, reject?: any) {
    const payload: JsonServicesPayload = new JsonServicesPayload();
    payload.method = 'logging.getLoggedVariables';
    this.json.requestByPayload(payload).subscribe(
      (resp: any) => {
        if (_.hasIn(resp, 'result.variables')) {
          this.state.set('requestVarsLogged', resp.result.variables);
        }
        if (callback) { callback(resp); }
      },
      (err: any) => {
        if (reject) { reject(err); }
      }
    );
  }

  public saveVar(varPayload: any, callback?: any, reject?: any) {
    const payload: JsonServicesPayload = new JsonServicesPayload();
    payload.method = varPayload.method;
    payload.params = varPayload.params;
    this.json.requestByPayload(payload).subscribe(
      (resp: any) => {
        if (callback) {
          callback(resp);
        } else {
          this.requestProductsAndVars();
        }
      },
      (err: any) => {
        if (reject) { reject(err); }
      }
    );
  }

  public requestProductsAndVars() {
    this.loading = true;
    this.getAppList(
      () => {
        this.getVariablesLogged(
          () => {
            // const products: any = this.state.get('products');
            const varServer: string = this.state.get('VarServer');
            if (varServer) {
              this.getVariables(
                varServer,
                (resp: any) => {
                  this.populateVariables();
                },
                (err: any) => {
                  this.loading = false;
                }
              );
            }
          },
          (err: any) => {
            this.loading = false;
          }
        );
      },
      (err: any) => {
        this.loading = false;
      }
    );
  }

  /**
   * Search function
   * @param {any[]} items
   * @param {string} searchVal
   * @returns {any[]}
   */
  private searchByString(items: any[], searchVal: string) {
    if (searchVal && searchVal.length) {
      /**
       * Transform search string toLowerCase for next searc
       * @type {string}
       */
      searchVal = searchVal.toLowerCase();
      /**
       * Found users will be stored here
       * @type {any[]}
       */
      const filtered: any[] = [];
      /**
       * Define prop names to search in
       * @type {string[]}
       */
      const propsToSearch = [
        'groupName',
        'value',
        'name'
      ];
      /**
       * Loop our items
       */
      items.forEach(function(item) {
        /**
         * Loop in allowed props to search
         */
        for (const propName of propsToSearch) {
          /**
           * Check if value exist and if it includes searchVal
           */
          if (item[propName] && item[propName].toLowerCase().indexOf(searchVal) !== -1) {
            /**
             * Found match push to filtered array and exit from current loop
             */
            filtered.push(item);
            break;
          }
        }
      });
      /**
       * Return filtered items
       */
      return filtered;
    } else {
      /**
       * Return empty result if searchVal is empty or not a string
       */
      return items;
    }
  }

}
