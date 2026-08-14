import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDrawer } from './menu-drawer';

describe('MenuDrawer', () => {
  let component: MenuDrawer;
  let fixture: ComponentFixture<MenuDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDrawer],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuDrawer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
