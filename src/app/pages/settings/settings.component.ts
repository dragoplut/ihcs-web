import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../app.service';

@Component({
  selector: 'settings',  // <settings></settings>
  styleUrls: [ './settings.component.scss' ],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  /**
   * Set our default values
   */

  /**
   * TypeScript public modifiers
   */
  constructor(
    public state: AppState,
    private router: Router
  ) {}

  public ngOnInit() {
    console.log('SettingsComponent inited.');
  }

  public goTo(route: string) {
    const routes: any = this.state.get('routes');
    this.state.set('activeRoute', routes[route]);
    this.router.navigate(routes[route].path);
  }
}
