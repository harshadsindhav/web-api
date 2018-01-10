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
import { environment } from './../../environments/environment';

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
  kWelcomePage = 'welcome-page';
  sindhav: string = 'sindhav';

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


  constructor(private resolver: ComponentFactoryResolver, private apiDocService: ApiDocService, private senitizer: DomSanitizer,
    private route: ActivatedRoute, private eleRef: ElementRef) {
  }

  ngOnInit() {}
}
