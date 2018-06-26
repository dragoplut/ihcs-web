import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { IJsonServicesPayload } from '../../shared/interfaces';
// import { JsonServicesPayload } from '../../shared/patterns/';

@Injectable()
export class JsonService {
  // private jsonEndpoint: string = 'http://192.168.157.167/index.lua/jsonservices';
  private jsonEndpoint: string = 'http://192.168.157.146/index.lua/jsonservices';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const deviceUrl: string = 'index.lua/static/';
    this.jsonEndpoint = location.href.indexOf(deviceUrl) === -1 ?
      'http://192.168.157.146/index.lua/jsonservices' : `${location.origin}/index.lua/jsonservices`;
      // 'http://192.168.157.167/index.lua/jsonservices' :
      // `${location.origin}/index.lua/jsonservices`;
  }

  public requestByPayload(payload: IJsonServicesPayload): Observable<any> {
    return this.http.post(
      this.jsonEndpoint,
      payload,
      this.getDefaultOptions()
    )
      .catch((err) => Observable.throw(err))
      .map((resp) => resp);
  }

  protected getDefaultOptions(optionalHeaders?: any): any {
    const headers: any = new HttpHeaders(optionalHeaders || {
      'Accept': '*/*',
      'Content-Type': 'application/json'
    });
    return { headers };
  }

  protected getDefaultOptionsUrlEncoded(optionalHeaders?: any): any {
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
