import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {PageTabsComponent} from './page-tabs.component';

describe('PageTabsComponent', () => {
  let component: PageTabsComponent;
  let fixture: ComponentFixture<PageTabsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageTabsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
