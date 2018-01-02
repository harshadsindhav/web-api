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
import {  FormBuilder,
          FormGroup,
          Validators,
          FormControl,
          NgForm } from '@angular/forms';
import {  Http,
          ResponseContentType } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApiDocService } from '../services/apidoc.service';
import { WebApiUtil } from './../web-api-util';
import { ApiTemplateComponent } from './../api-template/api-template.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('apiDetailContainer', {read: ViewContainerRef }) container;

  kApiDetailPage = 'apiDetailPage';
  kSearchResultPage = 'searchResultPage';
  kComponentApiPage = 'component-api-page';

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
  ngOnInit() {
    this.readFileNameMapping();
  }

  constructor(private resolver: ComponentFactoryResolver, private apiDocService: ApiDocService, private senitizer: DomSanitizer,
    private route: ActivatedRoute, private eleRef: ElementRef) {
      this.apiCategories = this.route.snapshot.data['apiListing'];
  }

  navigationItemOnClick(event) {
    const navItemName = event.target.innerHTML;
    if (navItemName && navItemName === 'Introduction') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.loadDynamicComponent(WebApiUtil.getFileURL(WebApiUtil.kIntroductionFileName));
    } else if (navItemName === 'About This Guide') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.loadDynamicComponent(WebApiUtil.getFileURL(WebApiUtil.kAboutThisGuideFileName));
    } else if (navItemName === 'Authentication') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.loadDynamicComponent(WebApiUtil.getFileURL(WebApiUtil.kAuthenticationFileName));
    } else if (navItemName === 'Limitations on Warranties and Liability') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.loadDynamicComponent(WebApiUtil.getFileURL(WebApiUtil.kSabaCopyRightFileName));
    } else if (navItemName === 'How to Contact Saba') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.loadDynamicComponent(WebApiUtil.getFileURL(WebApiUtil.kContactSabaFileName));
    }
    this.isUserNavigation = true;
  }

  onApiClickFromGrandChild(targetApi: any) {
    if (targetApi) {
      const targetApiTitle = targetApi.apiName.trim();
      this.currentApi = targetApi;
      this.isComponentApiDetail = false;
      this.isUserNavigation = false;
      this.contentPageName = this.kApiDetailPage;
      this.loadDynamicComponent(WebApiUtil.getFileURL(targetApi.apiFilePath));
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
    this.onApiClickFromGrandChild(searchedApi);
    this.contentPageName = this.kApiDetailPage;
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
              const temp = '"' + '<font style="background-color:yellow;"> '
              + this.globalSearchText + ' </font>' + '"';
              let matchedText = strippedFileBody.substring(searchTextIndex - 100, searchTextIndex + 100);
              matchedText = matchedText.replace(this.globalSearchText, temp);
              this.resultApis.push({
                'apiName': apiEntry.apiName,
                'apiFilePath': apiEntry.apiFilePath,
                'component': apiEntry.component,
                'module': apiEntry.module,
                'matchedText': matchedText.trim()
              });
              counter++;
            }
            this.contentPageName = this.kSearchResultPage;
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
    if (value  && value.length > 0) {
      return true;
    }
    return false;
  }
}
