// // dynamic-widget.directive.ts
// import { Directive, ViewContainerRef } from '@angular/core';

// @Directive({
//   selector: '[appDynamicWidget]'
// })
// export class DynamicWidgetDirective {
//   constructor(public viewContainerRef: ViewContainerRef) {}
// }


// dynamic-widget.directive.ts
import { Directive, Input, ViewContainerRef, OnInit } from '@angular/core';
import { widgetRegistry } from './widget-registry';

@Directive({
  selector: '[appDynamicWidget]',
  standalone: true
})
export class DynamicWidgetDirective implements OnInit {
  @Input('appDynamicWidget') widgetConfig: any;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const comp = widgetRegistry[this.widgetConfig.name];
    if (comp) {
      const ref = this.viewContainerRef.createComponent(comp);
      if ('onAction' in (ref.instance as any)) {
        (ref.instance as any)['onAction'] = () => {
          alert(`You clicked on ${this.widgetConfig.name}`);
        };
      }
    }
  }
}
