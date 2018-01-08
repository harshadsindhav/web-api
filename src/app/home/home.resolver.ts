
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { ApiDocService } from './../services/apidoc.service';
import { ConfigResolver } from './../config-resolver';
import { Injectable,  } from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HomeResolver implements Resolve<any> {

    constructor(private apiDocService: ApiDocService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
      return this.apiDocService.readApiListing();
    }

}
