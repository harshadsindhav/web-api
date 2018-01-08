

import { Injectable, OnInit} from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class ApiDocService {
    kNameMappingFile = './assets/apiFileNameListing.json';
    kApiListingFile = './assets/sabaapis.json';

    constructor(private _http: Http) {
    }

    public readApiListing(): Observable<any> {
        return this._http.get('./assets/sabaapis.json')
        .map((res: any) => res.json());
    }

    public findApisForComponent(): Observable<any> {
      return this._http.get(this.kNameMappingFile)
        .map(response => {
          console.log(response.json());
        });
    }

    public readNameMapping(): Observable<any> {
      return this._http.get(this.kNameMappingFile)
      .map((res: any) => res.json());
    }

    public readFile(fileName: string): Observable<any> {
      return this._http.get(fileName);
    }

}

