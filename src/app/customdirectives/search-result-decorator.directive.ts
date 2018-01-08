import { Directive, Input, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appSearchResultDecorator]'
})
export class SearchResultDecoratorDirective implements OnInit {
  @Input() appSearchResultDecorator: string;

  constructor(private ref: ElementRef) {
  }

  ngOnInit() {
    if (!this.appSearchResultDecorator) {
      this.appSearchResultDecorator = 'sindhav';
      let p = this.ref.nativeElement;
      console.log('text');
      console.log(p.innerHTML);
      /*let child = document.createElement('b');
      child.innerHTML = this.appSearchResultDecorator;
      p.innerHTML = p.innerHTML + this.appSearchResultDecorator;
      p.appendChild(child);
      p.innerHTML = p.innerHTML + this.appSearchResultDecorator;
      */
    }
  }

}
