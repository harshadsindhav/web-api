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
  iframeurl: string = './assets/preface-integrationstudio.html';
  myurl: any;
  categoryExpanded: boolean = true;
  contentPageName: string = 'apiDetailPage';
  resultApis: any[] = [];
  apiNameMapping: any[];
  componentName: string;
  currentApi: any;
  isComponentApiDetail: boolean = false;
  isUserNavigation: boolean = true;

  kApiDetailPage: string = 'apiDetailPage';
  kSearchResultPage: string = 'searchResultPage';
  kComponentApiPage: string = 'component-api-page';

  kIntroductionFileName = 'restwebservicesnew-introduction-concepts';
  kAboutThisGuideFileName = 'preface-integrationstudio';
  kAuthenticationFileName = 'restwebservices-authentication-concepts';
  kSabaCopyRightFileName = 'saba-copyright-topic';
  kContactSabaFileName = 'preface-common3-how-to-contact-saba';

  readonly kapiFilePath: string = 'apiFilePath';
  readonly kTitle: string = 'title';

  ngOnInit() {
    this.readFileNameMapping();
  }

  constructor(private apiDocService: ApiDocService, private senitizer: DomSanitizer,
    private route: ActivatedRoute, private eleRef: ElementRef) {
    this.myurl = this.getSafeURL(this.iframeurl);
    this.apiCategories = this.route.snapshot.data['apiListing'];
  }

  navigationItemOnClick(event) {
    console.log('testt');
    let navItemName = event.target.innerHTML;
    if (navItemName && navItemName === 'Introduction') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL('./assets//' + this.kIntroductionFileName + '.html');
    } else if (navItemName === 'About This Guide') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL('./assets/' + this.kAboutThisGuideFileName + '.html');
    } else if (navItemName === 'Authentication') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL('./assets/' + this.kAuthenticationFileName + '.html');
    } else if (navItemName === 'Limitations on Warranties and Liability') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL('./assets/' + this.kSabaCopyRightFileName + '.html');
    } else if (navItemName === 'How to Contact Saba') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL('./assets/' + this.kContactSabaFileName + '.html');
    }
    this.isUserNavigation = true;
  }

  onApiClickFromGrandChild(targetApi: any) {
    console.log(targetApi);
    if (targetApi) {
      let targetApiTitle = targetApi.apiName.trim();
      this.currentApi = targetApi;
      this.isComponentApiDetail = false;
      this.isUserNavigation = false;
      this.myurl = this.getSafeURL("./assets/" + targetApi.apiFilePath);
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
        this.apiDocService.readFile(apiEntry.apiFilePath)
          .subscribe(response => {
            let fileBody = response.text();
            if (fileBody.toLowerCase().includes(this.globalSearchText.toLowerCase())) {
              this.resultApis.push({
                'apiName': apiEntry.apiName,
                'apiFilePath': apiEntry.apiFilePath,
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
