import { Component, OnInit, ElementRef } from '@angular/core';
import { trigger, state, style, transition, animate, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-child-category',
  templateUrl: './child-category.component.html',
  styleUrls: ['./child-category.component.scss'],
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
export class ChildCategoryComponent implements OnInit {
  state: string;
  searchText: string;
  @Input('searchText') set value(val: string) {
    if (!val || val.length === 0) {
      this.state = 'closed';
    } else {
      this.state = 'open';
    }
  }
  @Input() apis: any;
  @Input() mainCategoryEleRef: ElementRef;
  @Output() onApiClick = new EventEmitter<any>();

  stateIcon: string = 'fa fa-angle-up';

  constructor(private eleRef: ElementRef) {
    this.state = 'closed';
  }
  toggleState() {
    this.stateIcon = this.state === 'closed' ? 'fa fa-angle-down' : 'fa fa-angle-up';
    this.state = this.state === 'closed' ? 'open' : 'closed';
  }
  ngOnInit() {

  }
  showApiDetail(event) {
    let targetApiTitle = event.target.innerHTML;
    if (targetApiTitle) {
      this.removeSelectedApiElement();
      event.target.className = 'selected';
      targetApiTitle = targetApiTitle.trim();
      this.onApiClick.emit({
        'apiName': targetApiTitle,
        'component': this.apis.category,
        'selectedApiEleRef': this.eleRef
      });
    }
  }

  removeSelectedApiElement() {
    let selectedElements = this.mainCategoryEleRef.nativeElement.getElementsByClassName('selected');
    if (selectedElements && selectedElements.length && selectedElements.length > 0) {
      for (let element of selectedElements) {
        element.className = '';
      }
    }
  }

}
