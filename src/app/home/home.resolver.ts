
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiDocService } from './../services/apidoc.service';
import { Injectable,  } from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HomeResolver implements Resolve<any> {

    constructor(private apiDocService: ApiDocService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
      console.log('home resolver called');
      return this.apiDocService.readApiListing();
    }

}
