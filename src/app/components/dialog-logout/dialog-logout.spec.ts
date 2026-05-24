import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLogout } from './dialog-logout';

describe('DialogLogout', () => {
  let component: DialogLogout;
  let fixture: ComponentFixture<DialogLogout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogLogout],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogLogout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
