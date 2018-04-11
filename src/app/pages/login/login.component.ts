import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/';
import { AppState } from '../../app.service';
import { AuthCred } from '../../shared/patterns/';

@Component({
  selector: 'login',  // <login></login>
  styleUrls: [ './login.component.scss' ],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  /**
   * Set our default values
   */
  public cred: AuthCred = new AuthCred();

  /**
   * TypeScript public modifiers
   */
  constructor(
    public _auth: AuthService,
    public router: Router,
    public state: AppState
  ) {}

  public ngOnInit() {
    /**
     * this.title.getData().subscribe(data => this.data = data);
     */
  }

  public authenticate(data: AuthCred) {
    this.getSalt(
      data.username,
      (salt: string) => this.logIn(data, salt),
      (err: any) => console.log(err)
    );
  }

  public getSalt(username: string, callback: any, reject: any) {
    this._auth.getSalt(username).subscribe(
      (resp: string) => callback(resp),
      (err: any) => reject(err)
    );
  }

  public logIn(data: AuthCred, salt: string) {
    console.log('logIn data: ', data, ' salt: ', salt);
    this._auth.logIn(data, salt).subscribe(
      (resp: string) => {
        console.log('logIn done: ', resp);
        const routes: any = this.state.get('routes');
        this.state.set('activeRoute', routes.settings);
        this.router.navigate(routes.settings.path);
      },
      (err: any) => console.log(err)
    );
  }
}
