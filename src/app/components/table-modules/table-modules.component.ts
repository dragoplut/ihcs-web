import {
  Component,
  Input,
  EventEmitter,
  AfterViewInit,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { MODULES_MOCK } from '../../shared/constants';
import { TYPE as T } from '../../shared/constants';
import { DialogManageGroupsComponent, DialogGroupSettingsComponent, DialogLogComponent } from '../';
import { Router } from '@angular/router';
import { AppState } from '../../app.service';

@Component({
  selector: 'table-modules',
  styleUrls: [ './table-modules.component.scss' ],
  templateUrl: './table-modules.component.html'
})

export class TableModulesComponent implements OnInit, AfterViewInit {

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
    'name',
    'size',
    'loopTime',
    'status',
    'errors',
    'menu'
  ];
  // public tableData: any[] = [];
  public groupsList: any[] = [];
  public groupsItems: any = new FormControl();
  public checkedAll: boolean = false;

  constructor(
    public dialog: MatDialog,
    public state: AppState,
    public router: Router,
  ) {}

  public ngOnInit() {
    // this.items = new MatTableDataSource<Element>(this.items);
    this.populateModules();
  }

  public ngAfterViewInit() {
    // this.items = new MatTableDataSource<Element>(this.tableData);
    this.items.paginator = this.paginator;
    this.items.sort = this.sort;
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

  public populateModules(searchValue?: string, checkUpdate?: boolean, filterGroups?: any[]) {
    const unfilteredItems: any[] = [];
    this.groupsList = [];
    MODULES_MOCK.forEach((item: any, idx: number) => {
      if (checkUpdate) {
        item.checked = this.checkedAll;
      } else {
        item.checked = false;
      }
      unfilteredItems.push(item);
    });
    this.items.data = this.searchByString(unfilteredItems, searchValue || '');
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

  public openLogDialog() {
    const dialogRef: any = this.dialog.open(DialogLogComponent, {
      width: '510px',
      data: {
        logIntervals: [1, 2, 3, 4, 5, 10, 15, 20, 30, 60],
        logOn: false,
        logMethod: 'time',
        interval: 3,
        gain: 1,
        offset: 0
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed, result: ', result);
    });
  }

  public goTo(destination: string) {
    switch (destination) {
      case 'show_logs':
        break;
    }
  }

  public selectAll() {
    this.populateModules('', true);
  }

  public newModule() {
    const item: any = {
      type: T.MODULE,
      parentId: '',
      id: 'new'
    };
    this.navigateTo(T.MODULE, item);
  }

  public navigateTo(route: string, item?: any) {
    const routes: any = this.state.get('routes');
    const activeRoute: any = routes[route];
    if (item) {
      activeRoute.path[2] = item.parentId;
      activeRoute.path[4] = item.id;
      this.router.navigate(activeRoute.path);
    } else {
      this.router.navigate(activeRoute.path);
    }
    this.state.set('activeRoute', activeRoute);
  }

  public filterGroups(groups: any) {
    if (groups && groups.value && groups.value.length) {
      this.populateModules('', false, groups.value);
    } else {
      this.populateModules('');
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
