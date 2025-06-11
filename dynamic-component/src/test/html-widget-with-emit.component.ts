// html-widget.component.ts
import {
  Component,
  Input,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter
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
  @Output() widgetAction = new EventEmitter<{ widgetId?: string; message: string }>();

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

        // Match elements inside HTML with class 'html-action'
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
    // Emit to parent
    this.widgetAction.emit({ widgetId: this.widgetId, message: msg });
  }
}


// <app-html-widget
//   *ngFor="let widget of widgets"
//   [html]="widget.html"
//   [widgetId]="widget.id"
//   (widgetAction)="handleWidgetAction($event)">
// </app-html-widget>

// handleWidgetAction(event: { widgetId?: string; message: string }) {
//   console.log('📨 Widget event received:', event);
// }