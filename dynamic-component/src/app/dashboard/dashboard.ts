// dashboard.component.ts
import {
  Component
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { DynamicWidgetDirective } from '../dynamic-widget.directive';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  standalone: true,
  imports: [DynamicWidgetDirective, CommonModule]
})
export class DashboardComponent {
  
  layout = {
    rows: [
      {
        columns: [
          {
            widgets: [
              { type: 'component', name: 'WeatherWidget' },
              { type: 'html', html: '<div style="color:green;">☘️ Hello from backend!</div>' }
            ]
          },
          {
            widgets: [
              { type: 'component', name: 'NewsWidget' }
            ]
          }
        ]
      },
      {
        columns: [
          {
            widgets: [
              { type: 'html', html: '<h3>🧠 Second row, first column</h3>' }
            ]
          }
        ]
      }
    ]
  };


  // @ViewChildren(DynamicWidgetDirective)
  // dynamicHosts!: QueryList<DynamicWidgetDirective>;

  // ngAfterViewInit() {
  //   this.dynamicHosts.forEach((host, columnIndex) => {
  //     const container = host.viewContainerRef;
  //     container.clear();

  //     const widgets = this.layout.columns[columnIndex].widgets;

  //     for (const widgetName of widgets) {
  //       const comp = widgetRegistry[widgetName];
  //       if (comp) {
  //         container.createComponent(comp);
  //       }
  //     }
  //   });
  // }
}
