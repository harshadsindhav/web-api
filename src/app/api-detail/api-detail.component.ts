import {
  Component,
  OnInit,
  ElementRef,
  ViewContainerRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChild
} from '@angular/core';
import { Observable } from 'Rxjs/Rx';

import {
  Http,
  ResponseContentType
} from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApiDocService } from '../services/apidoc.service';
import { WebApiUtil } from './../web-api-util';
import { ApiTemplateComponent } from './../api-template/api-template.component';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-api-detail',
  templateUrl: './api-detail.component.html',
  styleUrls: ['./api-detail.component.scss']
})
export class ApiDetailComponent implements OnInit {
  param1: any;
  @ViewChild('apiDetailContainer', { read: ViewContainerRef }) container;

  kApiDetailPage = 'apiDetailPage';
  kSearchResultPage = 'searchResultPage';
  kComponentApiPage = 'component-api-page';
  kWelcomePage = 'welcome-page';

  apiCategories: any;
  searchtext = '';
  globalSearchText = '';
  categoryExpanded = true;
  contentPageName: string = this.kWelcomePage;
  resultApis: any[] = [];
  apiNameMapping: any[];
  componentName: string;
  currentApi: any;
  isComponentApiDetail = false;
  isUserNavigation = true;

  constructor(private resolver: ComponentFactoryResolver, private apiDocService: ApiDocService, private senitizer: DomSanitizer,
    private route: ActivatedRoute, private eleRef: ElementRef) {
    this.contentPageName = this.kWelcomePage;
  }

  ngOnInit() {
    this.readFileNameMapping();
    this.route
      .queryParams
      .subscribe(params => {
        const apiName = params['apiName'];
        this.globalSearchText = params['searchText'];
        if (this.globalSearchText && this.globalSearchText.length > 0) {
          this.searchInAllApis();
        }
        const userNavigation = params['userNavigation'];
        if (userNavigation) {
          this.contentPageName = this.kApiDetailPage;
          this.isComponentApiDetail = false;
          this.isUserNavigation = true;
          this.loadDynamicComponent(WebApiUtil.getFileURL(userNavigation));
        } else {
          this.currentApi = {
            apiName: params['apiName'],
            component: params['component'],
            module: params['module'],
            apiFilePath: params['apiFilePath'],
          };
          if (this.currentApi && this.currentApi.apiFilePath) {
            this.loadDynamicComponent(WebApiUtil.getFileURL(this.currentApi.apiFilePath));
            this.contentPageName = this.kApiDetailPage;
            this.isComponentApiDetail = false;
            this.isUserNavigation = false;
          }
        }
      });
  }

  onApiClickFromGrandChild(targetApi: any) {
    if (targetApi) {
      const targetApiTitle = targetApi.apiName.trim();
      this.currentApi = targetApi;
      this.loadDynamicComponent(WebApiUtil.getFileURL(this.currentApi.apiFilePath));
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.isUserNavigation = false;
    }
  }

  loadDynamicComponent(fileurl) {
    if (this.container) {
      this.container.clear();
    }
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(ApiTemplateComponent);
    const containerRef = this.container.createComponent(factory);
    this.apiDocService.readFile(fileurl)
      .subscribe(response => {
        containerRef.location.nativeElement.innerHTML = response.text();
      });
  }

  getSafeURL(url: string) {
    return this.senitizer.bypassSecurityTrustResourceUrl(url);
  }

  searchedApi(searchedApi: any) {
    this.currentApi = searchedApi;
    this.contentPageName = this.kApiDetailPage;
    this.isComponentApiDetail = false;
    this.isUserNavigation = false;
    this.loadDynamicComponent(WebApiUtil.getFileURL(searchedApi.apiFilePath));
  }

  public searchInAllApis() {
    this.resultApis = [];
    let counter = 0;
    for (const apiEntry of this.apiNameMapping) {
      if (apiEntry.apiName) {
        this.apiDocService.readFile(WebApiUtil.kAssetRoot + apiEntry.apiFilePath)
          .subscribe(response => {
            const fileBody = response.text();
            const div = document.createElement('div');
            div.innerHTML = fileBody;
            let strippedFileBody = div.innerText;
            if (strippedFileBody.toLowerCase().includes(this.globalSearchText.toLowerCase())) {
              strippedFileBody = strippedFileBody.replace('"', '');
              const searchTextIndex = strippedFileBody.toLowerCase().indexOf(this.globalSearchText.toLowerCase());
              //const temp = '<font style="background-color:yellow;"> ' + this.globalSearchText + ' </font>';
              let matchedText = strippedFileBody.substring(searchTextIndex - 100, searchTextIndex + 100);
              //matchedText = matchedText.replace(this.globalSearchText, temp);
              this.resultApis.push({
                'apiName': apiEntry.apiName,
                'apiFilePath': apiEntry.apiFilePath,
                'component': apiEntry.component,
                'module': apiEntry.module,
                'matchedText': matchedText
              });
              counter++;
            }
            this.contentPageName = this.kSearchResultPage;
            if (this.container) {
              this.container.clear();
            }
          });
      }
    }
  }

  displayComponentApis(event) {
    if (this.container) {
      this.container.clear();
    }
    this.isComponentApiDetail = true;
    this.contentPageName = this.kComponentApiPage;
  }
  displayModuleComponents(event) {
    if (this.container) {
      this.container.clear();
    }
    this.isComponentApiDetail = false;
    this.contentPageName = this.kComponentApiPage;
  }

  readFileNameMapping() {
    this.apiDocService.readNameMapping()
      .subscribe(response => {
        this.apiNameMapping = response;
      });
  }
  isNotEmpty(value: any) {
    if (value && value.length > 0) {
      return true;
    }
    return false;
  }
}
