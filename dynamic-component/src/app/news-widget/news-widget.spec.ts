import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsWidget } from './news-widget';

describe('NewsWidget', () => {
  let component: NewsWidget;
  let fixture: ComponentFixture<NewsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
