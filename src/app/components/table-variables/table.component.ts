import {
  Component,
  Input,
  EventEmitter,
  AfterViewInit,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { VARIABLES_MOCK } from '../../shared/constants';
import { DialogManageGroupsComponent, DialogGroupSettingsComponent, DialogLogComponent } from '../';
import { AppState } from '../../app.service';
import { IJsonServiceVariableUpdate } from '../../shared/interfaces';
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';
import { ActiveRoute } from '../../shared/patterns';

@Component({
  selector: 'table-variables',
  styleUrls: [ './table.component.scss' ],
  templateUrl: './table.component.html'
})

// export interface Element {
//   name: string;
//   position?: number;
//   value: any;
//   groupName?: string;
// }

export class TableComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;

  @Input() public items: any = new MatTableDataSource<Element>([]);
  // options provided with temporary object as example
  @Input() public options: any = {
    actions: [
      { icon: 'plus', title: 'Add', action: 'add' },
    ],
    itemType: 'variables',
    info: 'Variables'
  };

  @Output() public confirmAction = new EventEmitter<any>();
  @Output() public rejectAction = new EventEmitter<any>();

  public displayedColumns: any = [
    'checked',
    'usage',
    'name',
    'value',
    'status',
    'groupName',
    'gain',
    'offset',
    'method',
    'menu'
  ];
  // public tableData: any[] = [];
  public searchStr: string = '';
  public groupsList: any[] = [];
  public groupsItems: any = new FormControl();
  public checkedAll: boolean = false;
  public canEdit: boolean = false;
  public loading: boolean = false;

  constructor(
    public state: AppState,
    public dialog: MatDialog,
    private router: Router
  ) {}

  public ngOnInit() {
    // this.items = new MatTableDataSource<Element>(this.items);
    const activeRoute: ActiveRoute = this.state.get('activeRoute');
    this.canEdit = activeRoute.path[0] === '/variables';
    // this.populateVariables(this.searchStr);
    setTimeout(() => this.populateVariables(this.searchStr), 1000);
  }

  public ngAfterViewInit() {
    // this.items = new MatTableDataSource<Element>(this.tableData);
    this.items.paginator = this.paginator;
    this.items.sort = this.sort;
    this.items.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
      if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toLocaleLowerCase();
      }
      return data[sortHeaderId];
    };
  }

  /**
   * Emit rejectAction with event details
   */
  public back(): void {
    const event: any = {
      action: 'cancel',
      items: this.items,
      type: this.options.itemType
    };
    this.rejectAction.emit(event);
  }

  public menuFor(item: any) {
    console.log('menuFor item: ', item);
  }

  public populateVariables(searchValue?: string, checkUpdate?: boolean, filterGroups?: any[]) {
    this.searchStr = searchValue;
    this.groupsList = [];
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
    variablesData.forEach((item: any, idx: number) => {
      const position: number = idx + 1;
      if (checkUpdate) {
        if (this.groupsItems && this.groupsItems.value && this.groupsItems.value.length) {
          if (this.groupsItems.value.indexOf(item.groupName) !== -1) {
            item.checked = this.checkedAll;
          }
        } else {
          item.checked = this.checkedAll;
        }
      } else {
        item.checked = false;
      }
      item.groupName = 'Group_' + position;
      if (item.name) {
        this.groupsList.push(item.groupName);
      }
      if (item && typeof item.value === 'object') {
        item.value = item.value.uValue || item.value.sValue || item.value.bValue;
      }
      if (varsLogged && varsLogged.length) {
        varsLogged.forEach((varLogged: any) => {
          if (item.name === varLogged.name) {
            for (const propName in varLogged) {
              if (propName) {
                if (propName === 'method') {
                  item[propName] = '' + varLogged[propName];
                } else {
                  item[propName] = varLogged[propName];
                }
              }
            }
            if (!item.method) {
              item.method = ' ';
            }
          }
        });
      }
      if (item.name) {
        if (filterGroups) {
          if (filterGroups.indexOf(item.groupName) !== -1) {
            if (_.includes(this.groupsItems.value, item.groupName)) {
              unfilteredItems.push(item);
            }
          }
        } else {
          unfilteredItems.push(item);
        }
      }

    });
    this.items.data = this.searchByString(unfilteredItems, this.searchStr || '');
  }

  public openManageGroupsDialog() {
    const dialogRef: any = this.dialog.open(DialogManageGroupsComponent, {
      width: '510px',
      data: { name: 'Some Name', groupName: '', groupsList: this.groupsList }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed, result: ', result);
    });
  }

  public openGroupSettingsDialog() {
    const dialogRef: any = this.dialog.open(DialogGroupSettingsComponent, {
      width: '510px',
      data: { name: 'Some Name', groupName: '', groupsList: this.groupsList }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed, result: ', result);
    });
  }

  public openLogDialog(item: any) {
    const dialogRef: any = this.dialog.open(DialogLogComponent, {
      width: '510px',
      data: {
        logIntervals: [1, 2, 3, 4, 5, 10, 15, 20, 30, 60],
        enabled: !!item.enabled,
        method: parseInt(item.method, 10) || 0,
        name: item.name,
        period: item.period || 0,
        gain: item.gain || 0,
        offset: item.offset || 0,
        type: item.type,
        value: item.value
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.name) {
        result.method = parseInt(result.method, 10);
        const varProps: string[] = ['enabled', 'gain', 'method', 'name', 'offset', 'period'];
        const variable: IJsonServiceVariableUpdate = _.pick(result, varProps);
        const setLoggedVariable: any = {
          method: 'logging.setLoggedVariable',
          params: [ { variable } ]
        };
        this.confirmAction.emit(setLoggedVariable);
        setTimeout(() => this.populateVariables(this.searchStr), 1500);
      }
    });
  }

  public goTo(destination: string, item: any) {
    switch (destination) {
      case 'group_settings':
        this.openGroupSettingsDialog();
        break;
      case 'log_settings':
        this.openLogDialog(item);
        break;
      case 'show_logs':
        if (item && item.data && item.data.length) {
          const varsLogged: any[] = _.filter(item.data, { checked: true });
          if (varsLogged && varsLogged.length) {
            const varNames: string[] = varsLogged.map((v: any) => v.name);
            const varParams: any = varNames && varNames.length > 1 ?
              varNames.join('::') : varNames[0];
            const routes: any = this.state.get('routes');
            this.state.set('activeRoute', routes['variables-logs']);
            this.router.navigate(routes['variables-logs'].path.concat([varParams]));
          }
        } else if (item && item.name) {
          const routes: any = this.state.get('routes');
          this.state.set('activeRoute', routes['variables-logs']);
          this.router.navigate(routes['variables-logs'].path.concat([item.name]));
        }
        break;
      default:
        break;
    }
  }

  public selectAll() {
    this.populateVariables(this.searchStr, true);
  }

  public filterGroups(groups: any) {
    if (groups && groups.value && groups.value.length) {
      this.populateVariables(this.searchStr, false, groups.value);
    } else {
      this.populateVariables(this.searchStr);
    }
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
