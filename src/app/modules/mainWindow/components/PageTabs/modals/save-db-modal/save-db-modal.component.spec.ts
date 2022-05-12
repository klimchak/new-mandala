import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveDbModalComponent } from './save-db-modal.component';

describe('SaveDbModalComponent', () => {
  let component: SaveDbModalComponent;
  let fixture: ComponentFixture<SaveDbModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveDbModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDbModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
