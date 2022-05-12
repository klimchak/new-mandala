import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveImageModalComponent } from './save-image-modal.component';

describe('SaveImageModalComponent', () => {
  let component: SaveImageModalComponent;
  let fixture: ComponentFixture<SaveImageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveImageModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
