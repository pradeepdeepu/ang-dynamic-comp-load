// html-widget.component.ts
import {
  Component,
  Input,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-html-widget',
  standalone: true,
  template: `<div #htmlContainer [innerHTML]="safeHtml"></div>`
})
export class HtmlWidgetComponent implements AfterViewInit, OnDestroy {
  @Input() html: string = '';
  @Input() widgetId?: string;

  @ViewChild('htmlContainer', { static: true }) htmlContainerRef!: ElementRef;
  safeHtml!: SafeHtml;

  private listener?: (e: Event) => void;

  constructor(private sanitizer: DomSanitizer) {}

  ngAfterViewInit(): void {
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.html);

    // Wait for HTML to render before attaching listener
    setTimeout(() => {
      this.listener = (e: Event) => {
        const target = e.target as HTMLElement;

        // Example: Match buttons inside HTML with class 'html-action'
        if (target.matches('.html-action')) {
          const msg = target.getAttribute('data-msg') || 'Clicked!';
          this.onHtmlAction(msg);
        }
      };

      this.htmlContainerRef.nativeElement.addEventListener('click', this.listener);
    });
  }

  ngOnDestroy(): void {
    if (this.listener) {
      this.htmlContainerRef.nativeElement.removeEventListener('click', this.listener);
    }
  }

  onHtmlAction(msg: string) {
    alert(`🟢 HTML Widget Triggered: ${msg}`);
  }
}





// <app-html-widget *ngIf="widget.type === 'html'" [html]="widget.html" [widgetId]="widget.id"></app-html-widget>


// <ng-container *ngFor="let widget of widgets">
//   <app-html-widget *ngIf="widget.type === 'html'" [html]="widget.html"></app-html-widget>
// </ng-container>