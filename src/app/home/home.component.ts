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
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  NgForm
} from '@angular/forms';
import {
  Http,
  ResponseContentType
} from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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
  @ViewChild('apiDetailContainer', { read: ViewContainerRef }) container;

  kApiDetailPage = 'apiDetailPage';
  kSearchResultPage = 'searchResultPage';
  kComponentApiPage = 'component-api-page';
  kWelcomePage = 'welcome-page';

  apiCategories: any;
  searchtext = '';
  globalSearchText = '';
  categoryExpanded = true;
  contentPageName: string = this.kApiDetailPage;
  resultApis: any[] = [];
  //apiNameMapping: any[];


  constructor(private resolver: ComponentFactoryResolver, private apiDocService: ApiDocService, private senitizer: DomSanitizer,
    private route: ActivatedRoute, private eleRef: ElementRef, private router: Router) {
      this.apiCategories = this.route.snapshot.data['apiListing'];
  }

  onApiClickFromGrandChild(targetApi: any) {
    if (targetApi) {
      const targetApiTitle = targetApi.apiName.trim();
      this.router.navigate(['/apireference/apidetail'],
        {
          queryParams: { apiName: targetApi.apiName,
                         component: targetApi.component,
                         module: targetApi.module,
                         apiFilePath: targetApi.apiFilePath
           }
        });
    }
  }

  navigationItemOnClick(event) {
    const navItemName = event.target.innerHTML;
    let navItemPage = '';
    if (navItemName === 'About This Guide') {
      navItemPage = WebApiUtil.kAboutThisGuideFileName;
    } else if (navItemName === 'Limitations on Warranties and Liability') {
      navItemPage = WebApiUtil.kSabaCopyRightFileName;
    } else if (navItemName === 'How to Contact Saba') {
      navItemPage = WebApiUtil.kContactSabaFileName;
    }
    this.router.navigate(['./home/apidetail'],
    {
      queryParams: {
        userNavigation : navItemPage
      }
    });
  }

  searchInAllApis() {
    console.log('searching in all apis home');
    this.router.navigate(['/apireference/apidetail'],
    {
      queryParams: { searchText: this.globalSearchText}
    });
  }

  ngOnInit() { }
}
