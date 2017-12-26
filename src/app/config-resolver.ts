import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable,  } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConfigResolver implements Resolve<any> {

  constructor(private _http: Http) {}

  resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._http.get('./assets/config.json')
        .map(response => {
          return response.json();
        });
  }

}
