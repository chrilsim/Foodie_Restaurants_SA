import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookinManagerment } from './bookin-managerment';

describe('BookinManagerment', () => {
  let component: BookinManagerment;
  let fixture: ComponentFixture<BookinManagerment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookinManagerment],
    }).compileComponents();

    fixture = TestBed.createComponent(BookinManagerment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
