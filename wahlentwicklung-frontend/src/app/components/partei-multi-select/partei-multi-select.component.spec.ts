import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParteiMultiSelectComponent } from './partei-multi-select.component';

describe('ParteiMultiSelectComponent', () => {
  let component: ParteiMultiSelectComponent;
  let fixture: ComponentFixture<ParteiMultiSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParteiMultiSelectComponent]
    });
    fixture = TestBed.createComponent(ParteiMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
