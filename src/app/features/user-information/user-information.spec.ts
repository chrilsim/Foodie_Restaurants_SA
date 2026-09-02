import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInformation } from './user-information';

describe('UserInformation', () => {
  let component: UserInformation;
  let fixture: ComponentFixture<UserInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInformation],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInformation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
