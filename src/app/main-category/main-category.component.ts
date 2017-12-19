import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { trigger, state, style, transition, animate, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-main-category',
  templateUrl: './main-category.component.html',
  styleUrls: ['./main-category.component.scss'],
  animations: [
    trigger(
      'slideHeight',
      [
        state('closed', style({
        display: 'none',
        height: 0
      })),
      state('open', style({
        display: 'block',
        height: '*'
      })),
      transition('* <=> *', [
        style({
          display: 'block',
          opacity : 0.2,
        }),
        animate('100ms ease')
      ])
      ]
    )
  ]
})
export class MainCategoryComponent implements OnInit {

  state: string;

  searchText: string;
  @Input('searchText') set value(val: string) {
    console.log('testttt');
    if (!val || val.length === 0) {
      this.state = 'closed';
      this.searchText = val;
    } else {
      this.state = 'open';
      this.searchText = val;
    }
  }

  @Input() mainCategory: any;
  @Input() mainCategoryEleRef: ElementRef;
  @Output() onApiClickFromGrandChild = new EventEmitter<any>();

  stateIcon: string = 'fa fa-angle-down';

  constructor() {

  }
  toggleState() {
    this.stateIcon = this.state === 'closed' ? 'fa fa-angle-up' : 'fa fa-angle-down';
    this.state = this.state === 'closed' ? 'open' : 'closed';
  }

  ngOnInit() {

  }
  onApiClick(targetApi: any) {
    targetApi.module = this.mainCategory.category;
    this.onApiClickFromGrandChild.emit(targetApi);
  }

}
