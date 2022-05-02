import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaviorComponent } from './savior.component';

describe('SaviorComponent', () => {
  let component: SaviorComponent;
  let fixture: ComponentFixture<SaviorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaviorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaviorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
