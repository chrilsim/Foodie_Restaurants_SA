import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderOnline } from './order-online';

describe('OrderOnline', () => {
  let component: OrderOnline;
  let fixture: ComponentFixture<OrderOnline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderOnline],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderOnline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
