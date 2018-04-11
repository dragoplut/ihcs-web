/**
 * Angular 2 decorators and services
 */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AppState } from './app.service';
import { ActiveRoute } from './shared/patterns/';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {

  constructor(
    public appState: AppState,
    public router: Router
  ) {}

  public ngOnInit() {
    const routes: any = {
      login: {
        path: ['', 'login'],
        pathTitle: 'LogIn'
      },
      settings: {
        path: ['', 'settings'],
        pathTitle: 'Settings'
      },
      variables: {
        path: ['', 'variables'],
        pathTitle: 'Variable Monitor',
        reference: 'settings',
        referenceTitle: 'Settings'
      },
    };

    const deviceUrl: string = 'index.lua/static/';
    const activeRoute: ActiveRoute = location.href.indexOf(deviceUrl) === -1 ?
      routes.login : routes.settings;

    this.appState.set('routes', routes);
    this.appState.set('activeRoute', activeRoute);
    console.log('Initial App State', this.appState.state);
  }

}

/**
 * Please review the https://github.com/AngularClass/angular-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
