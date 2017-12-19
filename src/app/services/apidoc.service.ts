

import { Injectable, OnInit} from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class ApiDocService {
    kNameMappingFile: string = "./assets/name_mapping.json";
    kApiListingFile: string = "./assets/sabaapis.json";

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
    private getApiFiles() {
      return [
        {
          "apiName": "Find details of country",
          "apiFileName": "Find details of country"
        },
        {
            "apiName": "Get all countries",
            "apiFileName": ""
        },
        {
          "apiName": "Get details of a particular country",
          "apiFileName": "Get details of a particular country"
        },
        {
          "apiName": "Get meta details of country",
          "apiFileName": "Get meta details of country"
        },
        {
          "apiName": "Create a new country",
          "apiFileName": "Create a new country"
        },
        {
          "apiName": "Delete country",
          "apiFileName": "Delete country"
        },
        {
          "apiName": "Update details of a country",
          "apiFileName": "Update details of a country"
        }
      ];
    }

    public readNameMapping(): Observable<any> {
      return this._http.get(this.kNameMappingFile)
      .map((res: any) => res.json());
    }

    public readFile(fileName: string): Observable<any> {
      return this._http.get("./assets/" + fileName);
    }

}

