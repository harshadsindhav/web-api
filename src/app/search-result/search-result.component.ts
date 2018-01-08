import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  @Input() searchResults: any[] = [];
  @Output() searchedApi = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  renderSearchedApi(resultApi: any) {
    this.searchedApi.emit(resultApi);
  }

  getComponentName(resultApi: any): string {
    if (resultApi) {
      return resultApi.module === 'People' ? resultApi.module : resultApi.component;
    }
  }
}
