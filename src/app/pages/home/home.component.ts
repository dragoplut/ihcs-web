import {
  Component,
  ViewChild,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

import { JsonService } from '../../services/';
import { AppState } from '../../app.service';
import { AuthService } from '../../services/';
import { ActiveRoute } from '../../shared/patterns/';
import { TYPE as T } from '../../shared/constants';
import { JsonServicesPayload } from '../../shared/patterns';
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';

@Component({
  selector: 'home',  // <home></home>
  styleUrls: [ './home.component.scss' ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  /**
   * Set our default values
   */
  public localState = { value: '', navTitle: '' };
  public activeRoute: ActiveRoute = new ActiveRoute();

  public navOpened = false;
  public reason = '';

  public nodes: any[] = [
    {
      id: 1,
      name: 'Variables',
      type: T.NONE,
      children: [
        { id: 11, name: 'Group_1', type: T.VARIABLES },
        { id: 12, name: 'Group_2', type: T.VARIABLES },
        { id: 13, name: 'Group_3', type: T.VARIABLES },
        { id: 14, name: 'Group_4', type: T.VARIABLES },
        { id: 15, name: 'Group_5', type: T.VARIABLES },
        { id: 16, name: 'Group_6', type: T.VARIABLES },
        { id: 17, name: 'Group_7', type: T.VARIABLES },
        { id: 18, name: 'Group_8', type: T.VARIABLES },
        { id: 19, name: 'Group_9', type: T.VARIABLES },
        { id: 20, name: 'Group_10', type: T.VARIABLES }
      ]
    },
    {
      id: 2,
      name: 'Appex Library',
      type: T.NONE,
      children: [
        { id: 21, name: 'Group_1', type: T.NONE },
        { id: 22, name: 'Group_2', type: T.NONE }
      ]
    },
    {
      id: 3,
      name: 'WDY22<35345><85000038>Device and Settings',
      type: T.NONE,
      children: [
        { id: 31, name: 'Properties', type: T.DEVICE },
        {
          id: 32,
          name: 'WebGUI',
          children: [
            { id: 1, name: 'subsub' }
          ]
        },
        {
          id: 33,
          name: 'ScreenGUI',
          children: [
            { id: 1, name: 'subsub' }
          ]
        },
        {
          id: 34,
          name: 'Modules',
          type: T.NONE,
          children: [
            {
              id: 7,
              parentId: 34,
              name: 'Local RVM\'s',
              type: T.MODULES,
              children: [
                { id: 71, parentId: 34, name: 'RVM 1', type: T.MODULE },
                { id: 72, parentId: 34, name: 'RVM 2', type: T.MODULE },
                { id: 73, parentId: 34, name: 'RVM 3', type: T.MODULE }
              ]
            }
          ]
        }
      ]
    },
    // {
    //   id: 4,
    //   name: 'WDY23<23453><85000039>Device and Settings',
    //   children: [
    //     { id: 41, name: 'Properties', type: T.DEVICE },
    //     {
    //       id: 42,
    //       name: 'WebGUI',
    //       children: [
    //         { id: 7, name: 'subsub' }
    //       ]
    //     },
    //     {
    //       id: 43,
    //       name: 'ScreenGUI',
    //       children: [
    //         { id: 1, name: 'subsub' }
    //       ]
    //     },
    //     {
    //       id: 44,
    //       name: 'Modules',
    //       children: [
    //         {
    //           id: 7,
    //           parentId: 44,
    //           name: 'Local RVM\'s',
    //           type: T.MODULES,
    //           children: [
    //             { id: 71, parentId: 44, name: 'RVM 1', type: T.MODULE },
    //             { id: 72, parentId: 44, name: 'RVM 2', type: T.MODULE },
    //             { id: 73, parentId: 44, name: 'RVM 3', type: T.MODULE }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      id: 5,
      name: 'FCP24<35346><1505024>Device and Settings',
      children: [
        { id: 51, name: 'Properties', type: T.DEVICE },
        {
          id: 52,
          name: 'WebGUI',
          children: [
            { id: 1, name: 'subsub' }
          ]
        },
        {
          id: 53,
          name: 'ScreenGUI',
          children: [
            { id: 1, name: 'subsub' }
          ]
        },
        {
          id: 54,
          name: 'Modules',
          children: [
            {
              id: 7,
              parentId: 54,
              name: 'Local RVM\'s',
              type: T.MODULES,
              children: [
                { id: 71, parentId: 54, name: 'RVM 1', type: T.MODULE },
                { id: 72, parentId: 54, name: 'RVM 2', type: T.MODULE },
                { id: 73, parentId: 54, name: 'RVM 3', type: T.MODULE }
              ]
            }
          ]
        }
      ]
    }
  ];
  public options: any = {};

  /**
   * TypeScript public modifiers
   */
  constructor(
    public _auth: AuthService,
    public state: AppState,
    public json: JsonService,
    public router: Router,
  ) {}

  public ngOnInit() {
    /**
     * this.title.getData().subscribe(data => this.data = data);
     */
    this.activeRoute = this.state.get('activeRoute');
    this.ping();
    this.getAppList();
    this.getVariables();
  }

  public close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  public logOut() {
    const deviceUrl: string = 'index.lua/static/';
    if (location.href.indexOf(deviceUrl) === -1) {
      this._auth.logOut().subscribe(
        (resp: any) => {
          const routes: any = this.state.get('routes');
          this.state.set('activeRoute', routes.login);
          this.router.navigate(routes.login.path);
        },
        (err: any) => console.log(err)
      );
    } else {
      const appmanagerUrl: string = '/index.lua/static/apps/appmanager/index.html';
      window.location.replace(appmanagerUrl);
      // this.router.navigateByUrl(appmanagerUrl);
    }
  }

  public ping() {
    this._auth.ping().subscribe(
      (resp: any) => console.log(resp),
      (err: any) => console.log(err)
    );
  }

  public getAppList() {
    const payload: JsonServicesPayload = new JsonServicesPayload();
    payload.method = 'appmanager.appList';
    this.json.requestByPayload(payload).subscribe(
      (resp: any) => {
        this.state.set('appList', resp);
        // if (resp && resp.result && resp.result.appInfo) {
        //   this.updateMenuDevices(resp.result.appInfo);
        // }
      },
      (err: any) => {
        console.log('getAppList err: ', err);
      }
    );
  }

  public getVariables() {
    const payload: JsonServicesPayload = new JsonServicesPayload();
    payload.method = '1505024.varmanager.requestVars';
    this.json.requestByPayload(payload).subscribe(
      (resp: any) => {
        this.state.set('requestVars', resp);
        if (resp && resp.result && resp.result.var) {
          this.updateMenuVariables(resp.result.var);
        }
      },
      (err: any) => {
        console.log('requestByPayload err: ', err);
      }
    );
  }

  public updateMenuVariables(vars: any[]) {
    this.nodes[0].children = [];
    vars.forEach((item: any, index: number) => {
      this.nodes[0].children.push({ id: 1000 + index, name: item.name, type: T.VARIABLES });
    });
  }

  public updateMenuDevices(devices: any[]) {
    const deviceIds: any[] = _.uniq(devices.map((item: any) => item.productNr));
    for (let i = 0; i < deviceIds.length; i++) {
      const nr: number = deviceIds[i];
      const namePrefix: string = nr > 8000000 ? 'WDY22' : 'FCP24';
      const deviceItem: any = {
        id: 3 + i,
        name: namePrefix + '<' + nr + '>Device and Settings',
        type: T.NONE,
        children: [
          { id: 31, name: 'Properties', type: T.DEVICE },
          {
            id: 32,
            name: 'WebGUI',
            children: [
              { id: 1, name: 'subsub' }
            ]
          },
          {
            id: 33,
            name: 'ScreenGUI',
            children: [
              { id: 1, name: 'subsub' }
            ]
          },
          {
            id: 34,
            name: 'Modules',
            type: T.NONE,
            children: [
              {
                id: 7,
                parentId: 34,
                name: 'Local RVM\'s',
                type: T.MODULES,
                children: [
                  { id: 71, parentId: 34, name: 'RVM 1', type: T.MODULE },
                  { id: 72, parentId: 34, name: 'RVM 2', type: T.MODULE },
                  { id: 73, parentId: 34, name: 'RVM 3', type: T.MODULE }
                ]
              }
            ]
          }
        ]
      };
      this.nodes[1 + i] = deviceItem;
    }
  }

  public goTo(route: string, item?: any) {
    const routes: any = this.state.get('routes');
    const activeRoute: any = routes[route];
    if (item) {
      switch (item.type) {
        case T.MODULE:
          activeRoute.path[2] = item.parentId;
          activeRoute.path[4] = item.id;
          this.router.navigate(activeRoute.path);
          break;
        case T.MODULES:
          activeRoute.path[2] = item.parentId;
          this.router.navigate(activeRoute.path);
          break;
        case T.VARIABLES:
          this.router.navigate(activeRoute.path, { queryParams: { groups: item.title } });
          break;
      }
    } else {
      this.router.navigate(activeRoute.path);
    }
    this.state.set('activeRoute', activeRoute);
  }

  public openMenu() {
    this.navOpened = !this.navOpened;
  }

  public onTreeEvent(event: any) {
    const existingRoutes: string[] = [
      T.DEVICE,
      T.MODULE,
      T.MODULES,
      T.VARIABLES
    ];
    const item: any = event.node.data;
    if (event.eventName === 'activate' && item && existingRoutes.indexOf(item.type) !== -1) {
      switch (item.type) {
        case T.MODULE:
          this.goTo(item.type, item);
          break;
        case T.MODULES:
          this.goTo(item.type, item);
          break;
        case T.VARIABLES:
          this.goTo(item.type, item);
          break;
        default:
          this.goTo(item.type);
          break;
      }
      this.openMenu();
    }
  }

  public submitState(value: string) {
    this.state.set('value', value);
    this.localState.value = '';
  }
}
