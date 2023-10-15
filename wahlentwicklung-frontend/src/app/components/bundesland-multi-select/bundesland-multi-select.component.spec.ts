import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundeslandMultiSelectComponent } from './bundesland-multi-select.component';

describe('BundeslandMultiSelectComponent', () => {
  let component: BundeslandMultiSelectComponent;
  let fixture: ComponentFixture<BundeslandMultiSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BundeslandMultiSelectComponent]
    });
    fixture = TestBed.createComponent(BundeslandMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
