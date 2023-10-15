import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParteiListComponent } from './partei-list.component';

describe('ParteiListComponent', () => {
  let component: ParteiListComponent;
  let fixture: ComponentFixture<ParteiListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParteiListComponent]
    });
    fixture = TestBed.createComponent(ParteiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
