

import { Directive, OnDestroy, HostListener, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[iframe-resizer]'
})

export class IFrameResizerDirective implements OnInit {

    constructor(private el: ElementRef) { }

    ngOnInit() {
      console.log(this.el.nativeElement.contentWindow.document.body.scrollHeight);
      //this.el.nativeElement.style.height = '1000px';
    }
}
