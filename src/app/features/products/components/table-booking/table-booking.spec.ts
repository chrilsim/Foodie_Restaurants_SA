import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBooking } from './table-booking';

describe('TableBooking', () => {
  let component: TableBooking;
  let fixture: ComponentFixture<TableBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableBooking],
    }).compileComponents();

    fixture = TestBed.createComponent(TableBooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
