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
import { DialogManageGroupsComponent, DialogGroupSettingsComponent, DialogLogComponent } from '../';
import { AppState } from '../../app.service';
import * as moment from 'moment';
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';

@Component({
  selector: 'table-variables-logs',
  styleUrls: [ './table-variables-logs.component.scss' ],
  templateUrl: './table-variables-logs.component.html'
})

export class TableVariablesLogsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;

  @Input() public varNames: string[] = [];
  @Input() public tableItems: any[] = [];
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

  public displayedColumns: any = [ 'datetime' ].concat(this.varNames);
  public groupsList: any[] = [];

  constructor(
    public state: AppState,
    public dialog: MatDialog,
    private router: Router
  ) {}

  public ngOnInit() {
    setTimeout(() => this.populateVariables(), 800);
  }

  public ngAfterViewInit() {
    // this.items = new MatTableDataSource<Element>(this.tableData);
    // this.items.data = [
    //   { datetime: '01/03/18 08:32 PM', value: 13 },
    //   { datetime: '02/03/18 08:32 PM', value: 12 },
    //   { datetime: '04/03/18 08:32 PM', value: 5.5 },
    //   { datetime: '07/03/18 08:32 PM', value: 14 },
    //   { datetime: '10/03/18 08:32 PM', value: 5 },
    //   { datetime: '11/03/18 08:32 PM', value: 3.5 },
    //   { datetime: '14/03/18 08:32 PM', value: 10 },
    //   { datetime: '17/03/18 08:32 PM', value: 6 },
    //   { datetime: '20/03/18 08:32 PM', value: 8.5 },
    //   { datetime: '23/03/18 08:32 PM', value: 16 },
    //   { datetime: '24/03/18 08:32 PM', value: 9 },
    //   { datetime: '27/03/18 08:32 PM', value: 13.5 },
    //   { datetime: '29/03/18 08:32 PM', value: 17 }
    // ];
    this.items.paginator = this.paginator;
    this.items.sort = this.sort;
  }

  public populateVariables(searchValue?: string, checkUpdate?: boolean, filterGroups?: any[]) {
    this.groupsList = [];
    const requestVarLog: any[] = this.state.get('requestVarLog');
    const varsLogged: any[] = this.state.get('requestVarsLogged');

    const names: string[] = _.uniq(requestVarLog.map((v: any) => v.name));
    this.varNames = names;

    // requestVarLog.forEach((v: any, i: number) => {
    //   for (let n = 0; n < names.length; n++) {
    //     if (!v[names[n]] && requestVarLog[i - 1][names[n]]) {
    //       v[names[n]] = requestVarLog[i - 1][names[n]] ? v[names[n - 1]] : '';
    //     }
    //   }
    // });
    const variables: any[] = requestVarLog.map((v: any) => {
      v.datetime = moment(v.datetime).add(moment().utcOffset(), 'minutes').toISOString();
      return v;
    });

    names.forEach((name: any) => {
      const varForChart: any = _.find(
        varsLogged,
        { name }
      );
      if (varForChart && varForChart.gain) {
        variables.forEach((v: any) => {
          if (v && v[name]) {
            v[name] = typeof v[name] === 'number' ? v[name] * varForChart.gain : v[name];
          }
        });
      }
    });

    if (!variables || !variables.length) {
      this.items.data = [
        { datetime: '01/03/18 08:32 PM', value: 13 },
        { datetime: '02/03/18 08:32 PM', value: 12 },
        { datetime: '04/03/18 08:32 PM', value: 5.5 },
        { datetime: '07/03/18 08:32 PM', value: 14 },
        { datetime: '10/03/18 08:32 PM', value: 5 },
        { datetime: '11/03/18 08:32 PM', value: 3.5 },
        { datetime: '14/03/18 08:32 PM', value: 10 },
        { datetime: '17/03/18 08:32 PM', value: 6 },
        { datetime: '20/03/18 08:32 PM', value: 8.5 },
        { datetime: '23/03/18 08:32 PM', value: 16 },
        { datetime: '24/03/18 08:32 PM', value: 9 },
        { datetime: '27/03/18 08:32 PM', value: 13.5 },
        { datetime: '29/03/18 08:32 PM', value: 17 }
      ];
    } else {
      this.displayedColumns = ['datetime'].concat(names);

      this.items.data = [];
      this.items.data = this.searchByString(variables, searchValue || '');
    }
  }

  public selectAll() {
    this.populateVariables('', true);
  }

  public filterGroups(groups: any) {
    if (groups && groups.value && groups.value.length) {
      this.populateVariables('', false, groups.value);
    } else {
      this.populateVariables('');
    }
  }

  /**
   * Search function
   * @param {any[]} items
   * @param {string} searchVal
   * @returns {any[]}
   */
  private searchByString(data: any[], searchVal: string) {
    let items: any[] = _.clone(data);
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
      const propsToSearch = this.displayedColumns;
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
          item[propName] = '' + item[propName];
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
