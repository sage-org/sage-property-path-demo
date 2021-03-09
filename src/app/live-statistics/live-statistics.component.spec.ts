import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveStatisticsComponent } from './live-statistics.component';

describe('LiveStatisticsComponent', () => {
  let component: LiveStatisticsComponent;
  let fixture: ComponentFixture<LiveStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
