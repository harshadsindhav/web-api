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
    this.myurl = this.getSafeURL(this.iframeurl);
    //this.loadDynamicComponent();
    this.apiCategories = this.route.snapshot.data['apiListing'];
  }

  navigationItemOnClick(event) {
    const navItemName = event.target.innerHTML;
    if (navItemName && navItemName === 'Introduction') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL(WebApiUtil.getFileURL(WebApiUtil.kIntroductionFileName));
      this.loadDynamicComponent();
    } else if (navItemName === 'About This Guide') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL(WebApiUtil.getFileURL(WebApiUtil.kAboutThisGuideFileName));
      this.loadDynamicComponent();
    } else if (navItemName === 'Authentication') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL(WebApiUtil.getFileURL(WebApiUtil.kAuthenticationFileName));
      this.loadDynamicComponent();
    } else if (navItemName === 'Limitations on Warranties and Liability') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL(WebApiUtil.getFileURL(WebApiUtil.kSabaCopyRightFileName));
      this.loadDynamicComponent();
    } else if (navItemName === 'How to Contact Saba') {
      this.contentPageName = this.kApiDetailPage;
      this.isComponentApiDetail = false;
      this.myurl = this.getSafeURL(WebApiUtil.getFileURL(WebApiUtil.kContactSabaFileName));
      this.loadDynamicComponent();
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
      //START
      //this.container.clear();
      //const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(ApiTemplateComponent);
      //let containerRef = this.container.createComponent(factory);
      //containerRef.location.nativeElement.innerHTML = this.getHtmlScriplet();
      this.loadDynamicComponent();
      //END
    }
  }

  loadDynamicComponent() {
    this.container.clear();
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(ApiTemplateComponent);
    let containerRef = this.container.createComponent(factory);
    containerRef.location.nativeElement.innerHTML = this.getHtmlScriplet();
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

  getHtmlScriplet() {
    return `<html>
    <head>
     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
     <meta charset="UTF-8">
     <meta name="copyright" content="(C) Copyright 2017">
     <meta name="DC.rights.owner" content="(C) Copyright 2017">
     <meta name="DC.Type" content="topic">
     <meta name="DC.Coverage" content="DRAFT">
     <meta name="DC.subject" content="foundation, restful web services, find details of sub audience types, foundation components, find details of sub audience types, find meta details of sub audience types, find meta details of sub audience types, get all sub audience types, get all sub audience types, get details of a particular sub audience type, get details of a particular sub audience type, create a new sub audience type, create a new sub audience type, find the details of sub audience type (using post - range based search), find the details of sub audience type (using post - range based search), update details of a sub audience type, update details of a sub audience type">
     <meta name="keywords" content="foundation, restful web services, find details of sub audience types, foundation components, find details of sub audience types, find meta details of sub audience types, find meta details of sub audience types, get all sub audience types, get all sub audience types, get details of a particular sub audience type, get details of a particular sub audience type, create a new sub audience type, create a new sub audience type, find the details of sub audience type (using post - range based search), find the details of sub audience type (using post - range based search), update details of a sub audience type, update details of a sub audience type">
     <meta name="DC.Relation" scheme="URI" content="../developer/part-foundation.html">
     <meta name="prodname" content="REST API Reference">
     <meta name="version" content="">
     <meta name="release" content="">
     <meta name="modification" content="">
     <meta name="DC.Creator" content="">
     <meta name="DC.Format" content="XHTML">
     <meta name="DC.Identifier" content="d0e656">
     <link rel="stylesheet" type="text/css" href="../commonltr.css">
     <title>Sub Audience Type</title>
     <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
     <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic" rel="stylesheet">
     <link href="./../../../styles.css" rel="stylesheet">
    </head>
    <body>
     <h4 class="title topictitle2" id="ariaid-title3">FIND META DETAILS OF SUB AUDIENCE TYPES</h4>
     <div class="body refbody">
      <section class="section">
       <h5 class="title sectiontitle">Overview</h5>
       <p class="p">Returns the meta details of the sub audience type.</p>
      </section>
      <section class="section">
       <h5 class="title sectiontitle">Requires OAuth</h5>
       <p class="p">No</p>
      </section>
      <section class="section">
       <h5 class="title sectiontitle">Method</h5>
       <p class="p">GET</p>
      </section>
      <section class="section">
       <h5 class="title sectiontitle">URL</h5>
       <p class="p">https://<var class="keyword varname">&lt;hostname-api.sabacloud.com&gt;</var>/v1/subaudiencetype/meta:(:searchFields)</p>
      </section>
      <section class="section">
       <h5 class="title sectiontitle">Calling Options</h5>
       <table id="reference_pv4_xn4_bx__table_tv4_xn4_bx">
        <caption>
         <span class="table--title-label">Table 2. </span>
         <span class="title">Calling Options</span>
         <span class="desc tabledesc">Calling Options</span>
        </caption>
        <colgroup>
         <col style="width:20%">
         <col style="width:25%">
         <col style="width:20%">
         <col style="width:20%">
         <col style="width:15%">
        </colgroup>
        <thead class="thead">
         <tr>
          <th class="entry colsep-1 rowsep-1" id="reference_pv4_xn4_bx__table_tv4_xn4_bx__entry__1">Name</th>
          <th class="entry colsep-1 rowsep-1" id="reference_pv4_xn4_bx__table_tv4_xn4_bx__entry__2">Description</th>
          <th class="entry colsep-1 rowsep-1" id="reference_pv4_xn4_bx__table_tv4_xn4_bx__entry__3">Default Value</th>
          <th class="entry colsep-1 rowsep-1" id="reference_pv4_xn4_bx__table_tv4_xn4_bx__entry__4">Data Type</th>
          <th class="entry colsep-1 rowsep-1" id="reference_pv4_xn4_bx__table_tv4_xn4_bx__entry__5">Required?</th>
         </tr>
        </thead>
        <tbody class="tbody">
         <tr>
          <td class="entry colsep-1 rowsep-1" headers="reference_pv4_xn4_bx__table_tv4_xn4_bx__entry__1 ">searchFields</td>
          <td class="entry colsep-1 rowsep-1" headers="reference_pv4_xn4_bx__table_tv4_xn4_bx__entry__2 ">Indicate what additional details needs to be returned. Acceptable values are (case-sensitive)</td>
          <td class="entry colsep-1 rowsep-1" headers="reference_pv4_xn4_bx__table_tv4_xn4_bx__entry__3 "></td>
          <td class="entry colsep-1 rowsep-1" headers="reference_pv4_xn4_bx__table_tv4_xn4_bx__entry__4 ">string</td>
          <td class="entry colsep-1 rowsep-1" headers="reference_pv4_xn4_bx__table_tv4_xn4_bx__entry__5 ">No</td>
         </tr>
        </tbody>
       </table>
      </section>
      <section class="section">
       <h5 class="title sectiontitle">Return Values</h5>
       <pre class="pre codeblock"><code>{
    "sampleData": {
     "parent_id": null,
     "flags": "0100000000",
     "name": "",
     "description": "",
     "customValues": {
      "custom9": null,
      "custom0": null,
      "custom3": null,
      "custom4": null,
      "custom1": null,
      "custom2": null,
      "custom7": null,
      "custom8": null,
      "custom5": null,
      "custom6": null
     },
     "securityDomain": {
      "id": "domin000000000000001",
      "displayName": null
     },
     "id": null,
     "href": "https://&lt;hostname-api.sabacloud.com&gt;/v1/subaudiencetype/seatc000000000000001"
    },
    "name": "Audience Sub Type",
    "displayName": "Audience Sub Type",
    "attributes": [{
     "name": "created_by",
     "displayName": "created_by",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "length": 255,
     "maximumLength": 255,
     "isSearchFilter": true
    }, {
     "name": "created_on",
     "displayName": "created_on",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "date",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "isSearchFilter": true
    }, {
     "name": "description",
     "displayName": "Description",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "length": 255,
     "maximumLength": 255,
     "isSearchFilter": true
    }, {
     "name": "flags",
     "displayName": "Flags",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "length": 10,
     "maximumLength": 10,
     "isSearchFilter": false
    }, {
     "name": "id",
     "displayName": "id",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "isSearchFilter": false
    }, {
     "name": "isretained",
     "displayName": "Available to Others",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "boolean",
     "isReference": false,
     "isProtected": false,
     "display": false,
     "isSearchFilter": false
    }, {
     "name": "name",
     "displayName": "Name",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "length": 80,
     "maximumLength": 80,
     "isSearchFilter": true
    }, {
     "name": "owner",
     "displayName": "Owner",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": false,
     "isSearchFilter": false
    }, {
     "name": "parent_id",
     "displayName": "Parent",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "object",
     "isReference": true,
     "isProtected": false,
     "display": true,
     "isSearchFilter": true
    }, {
     "name": "securityDomain",
     "displayName": "Domain",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "isSearchFilter": false
    }, {
     "name": "updated_by",
     "displayName": "updated_by",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "length": 255,
     "maximumLength": 255,
     "isSearchFilter": true
    }, {
     "name": "updated_on",
     "displayName": "updated_on",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "date",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "isSearchFilter": true
    }, {
     "name": "custom0",
     "displayName": "Custom0",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "length": 255,
     "maximumLength": 255,
     "isSearchFilter": true
    }, {
     "name": "custom1",
     "displayName": "Custom1",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "length": 255,
     "maximumLength": 255,
     "isSearchFilter": true
    }, {
     "name": "custom2",
     "displayName": "Custom2",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "length": 255,
     "maximumLength": 255,
     "isSearchFilter": true
    }, {
     "name": "custom3",
     "displayName": "Custom3",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "length": 255,
     "maximumLength": 255,
     "isSearchFilter": true
    }, {
     "name": "custom4",
     "displayName": "Custom4",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "length": 255,
     "maximumLength": 255,
     "isSearchFilter": true
    }, {
     "name": "custom5",
     "displayName": "Custom5",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "length": 255,
     "maximumLength": 255,
     "isSearchFilter": true
    }, {
     "name": "custom6",
     "displayName": "Custom6",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "length": 255,
     "maximumLength": 255,
     "isSearchFilter": true
    }, {
     "name": "custom7",
     "displayName": "Custom7",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "length": 255,
     "maximumLength": 255,
     "isSearchFilter": true
    }, {
     "name": "custom8",
     "displayName": "Custom8",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "length": 255,
     "maximumLength": 255,
     "isSearchFilter": true
    }, {
     "name": "custom9",
     "displayName": "Custom9",
     "description": null,
     "isRequired": false,
     "isAutoGenerated": false,
     "type": "string",
     "isReference": false,
     "isProtected": false,
     "display": true,
     "length": 255,
     "maximumLength": 255,
     "isSearchFilter": true
    }]
   }</code></pre>
      </section>
     </div>
    </body>
   </html>`;
  }
}
