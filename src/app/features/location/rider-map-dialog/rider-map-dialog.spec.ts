import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderMapDialog } from './rider-map-dialog';

describe('RiderMapDialog', () => {
  let component: RiderMapDialog;
  let fixture: ComponentFixture<RiderMapDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderMapDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(RiderMapDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
