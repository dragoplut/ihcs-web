import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import * as SHA512 from 'crypto-js/sha512';
import * as ENCHEX from 'crypto-js/enc-hex';
import { IAuthCred } from '../../shared/interfaces';
import { ActiveRoute } from '../../shared/patterns/';

@Injectable()
export class AuthService {
  // private luaEndpoint: string = 'http://192.168.157.167/index.lua';
  private luaEndpoint: string = 'http://192.168.157.146/index.lua';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const deviceUrl: string = 'index.lua/static/';
    this.luaEndpoint = location.href.indexOf(deviceUrl) === -1 ?
      'http://192.168.157.146/index.lua' : `${location.origin}/index.lua`;
      // 'http://192.168.157.167/index.lua' : `${location.origin}/index.lua`;
  }

  public getSalt(username: string): Observable<any> {
    const timeNow: string = new Date().getTime().toString();
    return this.http.get(
      `${this.luaEndpoint}/credentials?username=${username}&_=${timeNow}`,
      {responseType: 'text'}
    )
        .catch((err: any) => {
          return Observable.throw(err);
        })
        .map((resp: any) => {
          return resp;
        });
  }

  public logIn(cred: IAuthCred, saltsString: string): Observable<any> {
    const salts: string[] = saltsString.split(',');
    const hash: string = SHA512(SHA512(cred.password + salts[0]) + salts[1])
      .toString(ENCHEX);
    const body: any = {
      redirectUrl: '/static/apps/usermanagement/index.html#/replaceDefaultUser',
      password: hash,
      username: cred.username
    };
    return this.http.post(
      `${this.luaEndpoint}/login`,
      this.transformRequest(body),
      this.getDefaultOptions()
    )
      .catch((err) => Observable.throw(err))
      .map((resp) => resp);
  }

  public logOut(): Observable<any> {
    return this.http.get(
      `${this.luaEndpoint}/logout`, this.getDefaultOptions())
      .catch((err) => Observable.throw(err))
      .map((resp) => resp);
  }

  public ping(): Observable<any> {
    return this.http.get(
      `${this.luaEndpoint}/ping`, this.getDefaultOptions())
      .catch((err) => Observable.throw(err))
      .map((resp) => resp);
  }

  protected getDefaultOptions(optionalHeaders?: any): any {
    const headers: any = new HttpHeaders(optionalHeaders || {
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return { headers, responseType: 'text' };
  }

  private transformRequest(obj: any) {
    const str: any = [];
    for (const p in obj) {
      if (p) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    return str.join('&');
  }
}
