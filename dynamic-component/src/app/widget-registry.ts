// widget-registry.ts

import { NewsWidgetComponent } from "./news-widget/news-widget";
import { WeatherWidgetComponent } from "./weather-widget/weather-widget";


export const widgetRegistry: Record<string, any> = {
    WeatherWidget: WeatherWidgetComponent,
    NewsWidget: NewsWidgetComponent
};
