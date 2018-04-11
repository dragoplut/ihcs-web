import {
  Component,
  ViewChild,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

import { AppState } from '../../app.service';
import { AuthService } from '../../services/';
import { ActiveRoute } from '../../shared/patterns/';

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

  /**
   * TypeScript public modifiers
   */
  constructor(
    public _auth: AuthService,
    public state: AppState,
    public router: Router,
  ) {}

  public ngOnInit() {
    console.log('hello `Home` component', this.state._state);
    /**
     * this.title.getData().subscribe(data => this.data = data);
     */
    this.activeRoute = this.state.get('activeRoute');
    this.ping();
  }

  public close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  public logOut() {
    const deviceUrl: string = 'index.lua/static/';
    console.log('logOut: ', location);
    if (location.href.indexOf(deviceUrl) === -1) {
      this._auth.logOut().subscribe(
        (resp: any) => {
          console.log(resp);
          const routes: any = this.state.get('routes');
          this.state.set('activeRoute', routes.login);
          this.router.navigate(routes.login.path);
        },
        (err: any) => console.log(err)
      );
    } else {
      const appmanagerUrl: string = '/index.lua/static/apps/appmanager/index.html';
      location.replace(location.host + appmanagerUrl);
      // this.router.navigateByUrl(appmanagerUrl);
    }
  }

  public ping() {
    this._auth.ping().subscribe(
      (resp: any) => console.log(resp),
      (err: any) => console.log(err)
    );
  }

  public goTo(route: string) {
    const routes: any = this.state.get('routes');
    this.state.set('activeRoute', routes[route]);
    this.router.navigate(routes[route].path);
  }

  public openMenu() {
    console.log('openMenu');
    if (this.navOpened) {
      this.sidenav.close();
      this.navOpened = false;
    } else {
      this.sidenav.open();
      this.navOpened = true;
    }
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.state.set('value', value);
    this.localState.value = '';
  }
}
