import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColoredModalComponent } from './colored-modal.component';

describe('ColoredModalComponent', () => {
  let component: ColoredModalComponent;
  let fixture: ComponentFixture<ColoredModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColoredModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColoredModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
