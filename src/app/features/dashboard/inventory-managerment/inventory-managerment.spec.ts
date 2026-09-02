import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryManagerment } from './inventory-managerment';

describe('InventoryManagerment', () => {
  let component: InventoryManagerment;
  let fixture: ComponentFixture<InventoryManagerment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryManagerment],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryManagerment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
