import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddressDialog } from './add-address-dialog';

describe('AddAddressDialog', () => {
  let component: AddAddressDialog;
  let fixture: ComponentFixture<AddAddressDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAddressDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAddressDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
