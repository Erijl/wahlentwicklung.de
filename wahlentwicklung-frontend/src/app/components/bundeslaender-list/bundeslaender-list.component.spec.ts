import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundeslaenderListComponent } from './bundeslaender-list.component';

describe('BundeslaenderListComponent', () => {
  let component: BundeslaenderListComponent;
  let fixture: ComponentFixture<BundeslaenderListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BundeslaenderListComponent]
    });
    fixture = TestBed.createComponent(BundeslaenderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
