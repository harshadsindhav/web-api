import { Component, OnInit, ElementRef } from '@angular/core';
import { Observable } from 'Rxjs/Rx';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { Http, ResponseContentType } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApiDocService } from '../services/apidoc.service';
import { WebApiUtil } from './../web-api-util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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

  constructor(private apiDocService: ApiDocService, private senitizer: DomSanitizer,
    private route: ActivatedRoute, private eleRef: ElementRef) {
    this.myurl = this.getSafeURL(this.iframeurl);
    this.apiCategories = this.route.snapshot.data['apiListing'];
  }

  navigationItemOnClick(event) {
    const navItemName = event.target.innerHTML;
    if (navItemName && navItemName === 'Introduction') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL(WebApiUtil.getFileURL(WebApiUtil.kIntroductionFileName));
    } else if (navItemName === 'About This Guide') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL(WebApiUtil.getFileURL(WebApiUtil.kAboutThisGuideFileName));
    } else if (navItemName === 'Authentication') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL(WebApiUtil.getFileURL(WebApiUtil.kAuthenticationFileName));
    } else if (navItemName === 'Limitations on Warranties and Liability') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL(WebApiUtil.getFileURL(WebApiUtil.kSabaCopyRightFileName));
    } else if (navItemName === 'How to Contact Saba') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL(WebApiUtil.getFileURL(WebApiUtil.kContactSabaFileName));
    }
    this.isUserNavigation = true;
  }

  onApiClickFromGrandChild(targetApi: any) {
    if (targetApi) {
      const targetApiTitle = targetApi.apiName.trim();
      this.currentApi = targetApi;
      this.isComponentApiDetail = false;
      this.isUserNavigation = false;
      this.myurl = this.getSafeURL(WebApiUtil.kAssetRoot + targetApi.apiFilePath);
      this.contentPageName = this.kApiDetailPage;
      //let iframeElement = this.eleRef.nativeElement.getElementById('myiframetest');
      //iframeElement.style.height = iframeElement.contentWindow.document.body.scrollHeight + 'pxs';
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
    this.resultApis = [];
    let counter = 0;
    for (const apiEntry of this.apiNameMapping) {
      if (apiEntry.apiName) {
        this.apiDocService.readFile(apiEntry.apiFilePath)
          .subscribe(response => {
            const fileBody = response.text();
            const div = document.createElement('div');
            div.innerHTML = fileBody;
            let strippedFileBody = div.innerText;
            if (strippedFileBody.toLowerCase().includes(this.globalSearchText.toLowerCase())) {
              strippedFileBody = strippedFileBody.replace('"', '');
              const searchTextIndex = strippedFileBody.toLowerCase().indexOf(this.globalSearchText.toLowerCase());
              const temp = '"' + '<font style="background-color:yellow;background-color: yellow"> '
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
