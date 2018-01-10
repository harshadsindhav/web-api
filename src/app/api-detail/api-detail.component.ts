import {  Component,
        OnInit,
        ElementRef,
        ViewContainerRef,
        ComponentFactory,
        ComponentFactoryResolver,
        ComponentRef,
        ViewChild
      } from '@angular/core';
import { Observable } from 'Rxjs/Rx';

import {  Http,
          ResponseContentType} from '@angular/http';
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
  @ViewChild('apiDetailContainer', {read: ViewContainerRef }) container;

    kApiDetailPage = 'apiDetailPage';
    kSearchResultPage = 'searchResultPage';
    kComponentApiPage = 'component-api-page';
    kWelcomePage = 'welcome-page';

    apiCategories: any;
    searchtext = '';
    globalSearchText = '';
    iframeurl: string = WebApiUtil.getIndexPageURL();
    myurl: any;
    categoryExpanded = true;
    contentPageName: string = this.kApiDetailPage;
    resultApis: any[] = [];
    apiNameMapping: any[];
    componentName: string;
    currentApi: any;
    isComponentApiDetail = false;
    isUserNavigation = true;
    iframeHeight: any;

  constructor(private resolver: ComponentFactoryResolver, private apiDocService: ApiDocService, private senitizer: DomSanitizer,
    private route: ActivatedRoute, private eleRef: ElementRef) {
      console.log('Is Prod Mode: ' + environment.production);
      this.apiCategories = this.route.snapshot.data['apiListing'];
      this.contentPageName = this.kWelcomePage;
  }


  ngOnInit() {
    this.route
    .queryParams
    .subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.id = params['id'] || 0;
    });
  }



}
