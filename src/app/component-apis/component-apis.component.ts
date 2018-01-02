import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiDocService } from '../services/apidoc.service';

@Component({
  selector: 'app-component-apis',
  templateUrl: './component-apis.component.html',
  styleUrls: ['./component-apis.component.scss']
})
export class ComponentApisComponent implements OnInit {
  @Input() apiDetail: any;
  @Input() apiNameMapping: any[];
  @Input() isComponentApiDetail = false;
  apis: any[] = [];
  categories: any[] = [];
  @Output() getApiDetail = new EventEmitter<any>();

  constructor() {

  }

  ngOnInit() {
    if (this.apiNameMapping) {
      for (const entry of this.apiNameMapping) {
        if (this.isComponentApiDetail && this.apiDetail && this.apiDetail.component &&
          this.apiDetail.component === entry.component) {
          this.apis.push(entry);
        } else {
        if (this.apiDetail && this.apiDetail.module && this.apiDetail.module.toLowerCase() === entry.module.toLowerCase() &&
          this.isUnique(entry)) {
          this.categories.push(entry);
        }
      }
    }
  }
}

  private isUnique(entry: any): boolean {
    if (entry) {
      for (const categoryEntry of this.categories) {
        if (entry.module && entry.component === categoryEntry.component) {
            return false;
        }
      }
    }
    return true;
  }

  getDetailOfApi(api: any) {
    this.getApiDetail.emit(api);
  }

  getComponentApis(category: any) {
    this.isComponentApiDetail = true;
    this.apiDetail = category;
    this.ngOnInit();
  }

  getModuleComponents(apiDetail: any) {
    this.isComponentApiDetail = false;
    this.apiDetail = apiDetail;
    this.ngOnInit();
  }

  isNotEmpty(value: any) {
    if (value  && value.length > 0) {
      return true;
    }
    return false;
  }
}
