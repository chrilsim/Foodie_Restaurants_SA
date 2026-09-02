import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderViewDialog } from './order-view-dialog';

describe('OrderViewDialog', () => {
  let component: OrderViewDialog;
  let fixture: ComponentFixture<OrderViewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderViewDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderViewDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
