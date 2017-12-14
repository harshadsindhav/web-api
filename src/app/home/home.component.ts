import { Component, OnInit, ElementRef } from '@angular/core';
import { Observable } from 'Rxjs/Rx';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { Http, ResponseContentType } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApiDocService } from '../services/apidoc.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  apiCategories: any;
  searchtext: string = '';
  globalSearchText: string = '';
  iframeurl: string = './assets/Find details of facilities.html';
  myurl: any;
  categoryExpanded: boolean = true;
  contentPageName: string = 'apiDetailPage';
  resultApis: any[] = [];
  apiNameMapping: any[];
  componentName: string;
  currentApi: any;
  isComponentApiDetail: boolean = false;

  kApiDetailPage: string = 'apiDetailPage';
  kSearchResultPage: string = 'searchResultPage';
  kComponentApiPage: string = 'component-api-page';

  ngOnInit() {
    this.readFileNameMapping();
  }

  constructor(private apiDocService: ApiDocService, private senitizer: DomSanitizer,
    private route: ActivatedRoute, private eleRef: ElementRef) {
    this.myurl = this.getSafeURL(this.iframeurl);
    this.apiCategories = this.route.snapshot.data['apiListing'];
    this.currentApi = {
      "apiName": "Find details of facilities",
      "fileName": "Find details of facilities",
      "component": "Facility",
      "module": "Foundation"
    };
  }

  onApiClickFromGrandChild(targetApi: any) {
    if (targetApi) {
      let targetApiTitle = targetApi.apiName.trim();
      this.currentApi = targetApi;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL("./assets/" + targetApiTitle + ".html");
      this.contentPageName = this.kApiDetailPage;
    }
  }

  getSafeURL(url: string) {
    return this.senitizer.bypassSecurityTrustResourceUrl(url);
  }

  searchedApi(searchedApi: any) {
    this.onApiClickFromGrandChild(searchedApi);
    this.contentPageName = this.kApiDetailPage;
  }

  public searchInAllApis() {
    for (let apiEntry of this.apiNameMapping) {
      if (apiEntry.apiName) {
        this.apiDocService.readFile(apiEntry.fileName)
          .subscribe(response => {
            let fileBody = response.text();
            if (fileBody.toLowerCase().includes(this.globalSearchText.toLowerCase())) {
              this.resultApis.push({
                'apiName': apiEntry.apiName,
                'fileName': apiEntry.fileName,
                'component': apiEntry.component,
                'module': apiEntry.module
              });
            }
            this.contentPageName = this.kSearchResultPage;
          });
      }
    }
  }
  displayComponentApis(event) {
    this.isComponentApiDetail = true;
    this.contentPageName = this.kComponentApiPage;
  }
  displayModuleComponents(event) {
    this.isComponentApiDetail = false;
    this.contentPageName = this.kComponentApiPage;
  }

  readFileNameMapping() {
    this.apiDocService.readNameMapping()
      .subscribe(response => {
        this.apiNameMapping = response;
      });
  }

}
