import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingInvoice } from './booking-invoice';

describe('BookingInvoice', () => {
  let component: BookingInvoice;
  let fixture: ComponentFixture<BookingInvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingInvoice],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingInvoice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
