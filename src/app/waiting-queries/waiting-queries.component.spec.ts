import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingQueriesComponent } from './waiting-queries.component';

describe('WaitingQueriesComponent', () => {
  let component: WaitingQueriesComponent;
  let fixture: ComponentFixture<WaitingQueriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitingQueriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
