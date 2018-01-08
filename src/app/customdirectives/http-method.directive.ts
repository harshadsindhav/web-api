import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHttpMethod]'
})
export class HttpMethodDirective implements OnInit {
  @Input() appHttpMethod: string;

  constructor(private elementRef: ElementRef) {
  }
  ngOnInit() {
    if  (this.appHttpMethod === 'GET') {
        this.elementRef.nativeElement.style.backgroundColor = '#0061ac';
    } else if (this.appHttpMethod === 'POST') {
        this.elementRef.nativeElement.style.backgroundColor = '#04a73a';
    } else if (this.appHttpMethod === 'PUT') {
        this.elementRef.nativeElement.style.backgroundColor = '#b06300';
    } else if(this.appHttpMethod === 'DELETE') {
        this.elementRef.nativeElement.style.backgroundColor = '#a20909';
    }
  }
}
