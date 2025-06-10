// dashboard.component.ts
import {
  AfterViewInit,
  Component,
  QueryList,
  ViewChildren
} from '@angular/core';

import { DynamicWidgetDirective } from '../dynamic-widget.directive';
import { widgetRegistry } from '../widget-registry';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  standalone: true,
  imports: [DynamicWidgetDirective, CommonModule]
})
export class DashboardComponent implements AfterViewInit {
  layout = {
    columns: [
      { widgets: ['WeatherWidget'] },
      { widgets: ['NewsWidget', 'WeatherWidget', 'WeatherWidget'] }
    ]
  };

  @ViewChildren(DynamicWidgetDirective)
  dynamicHosts!: QueryList<DynamicWidgetDirective>;

  ngAfterViewInit() {
    this.dynamicHosts.forEach((host, columnIndex) => {
      const container = host.viewContainerRef;
      container.clear();

      const widgets = this.layout.columns[columnIndex].widgets;

      for (const widgetName of widgets) {
        const comp = widgetRegistry[widgetName];
        if (comp) {
          container.createComponent(comp);
        }
      }
    });
  }
}
