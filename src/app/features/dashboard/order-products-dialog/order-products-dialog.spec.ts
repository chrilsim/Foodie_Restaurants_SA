import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderProductsDialog } from './order-products-dialog';

describe('OrderProductsDialog', () => {
  let component: OrderProductsDialog;
  let fixture: ComponentFixture<OrderProductsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderProductsDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderProductsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
