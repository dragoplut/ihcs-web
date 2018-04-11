import { Injectable, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// noinspection TypeScriptCheckImport
import * as _ from 'lodash';

@Injectable()
export class ApiService implements OnInit {

  public headers: HttpHeaders = new HttpHeaders();
  // protected endpoint: string = process.env.API_URL;
  protected endpoint: string = 'http://192.168.157.167';

  constructor(
    public http: HttpClient,
    public router: Router
  ) {}

  public ngOnInit() {
    this.headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-type': 'application/json'
    });
  }

  public get(path: string): Observable<any> {
    return this.http.get(`${this.endpoint}${path}`, this.getDefaultOptions())
      .catch(this.catchErr)
      .map(this.getJson);
  }

  public post(path: string, body: any, options?: any): Observable<any> {
    return this.http.post(
      `${this.endpoint}${path}`,
      body,
      this.getDefaultOptions(options)
      )
      .catch(this.catchErr)
      .map(this.getJson);
  }

  public put(path: string, body: any): Observable<any> {
    return this.http.put(
      `${this.endpoint}${path}`,
      JSON.stringify(body),
      this.getDefaultOptions()
      )
      .catch(this.catchErr)
      .map(this.getJson);
  }

  public delete(path: string): Observable<any> {
    return this.http.delete(`${this.endpoint}${path}`, this.getDefaultOptions())
      .catch(this.catchErr)
      .map(this.getJson);
  }

  /**
   * Set request headers
   * @param headers
   */
  public setHeaders(headers) {
     Object.keys(headers)
      .forEach((header: any) => this.headers.set(header, headers[header]));
  }

  /**
   * Get json parsed response _body
   * @param {HttpResponse} resp
   * @returns {HttpResponse}
   */
  public getJson(resp: any) {
    const r: any = _.clone(resp);
    /**
     * Handle empty _body response
     */
    return r && r._body && r._body.length ? resp.json() : resp;
  }

  public checkForError(resp: any): any {
    if (resp.status >= 500) {
      /**
       * If 500 server error. Return response.
       */
      return resp;
    } else if (resp.status >= 200 && resp.status < 300) {
      /**
       * Valid response.
       */
      return resp;
    } else if (resp.status === 401) {
      /**
       * If 401 not authorized. Return response and perform some action.
       */
      const error = new Error(resp.statusText);
      error['response'] = resp;
      sessionStorage.clear();
      this.router.navigate(['/login']);
      throw error;
    } else {
      const error = new Error(resp.statusText);
      error['response'] = resp;
      throw error;
    }
  }

  public catchErr(err: any) {
    if (err && err._body && typeof err._body === 'string') {
      const errBody: any = JSON.parse(err._body);
      err.message = errBody && errBody.error && errBody.error.message ?
        errBody.error.message : 'Error.';
    }
    return Observable.throw(err);
  }

  protected getDefaultOptions(optionalHeaders?: any): any {
    const token: string = sessionStorage.getItem('token');
    const headers: any = new HttpHeaders(optionalHeaders || {
      'Accept': 'application/json',
      'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return { headers };
  }
}
