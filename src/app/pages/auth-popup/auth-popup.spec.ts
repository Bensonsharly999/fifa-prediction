import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPopup } from './auth-popup';

describe('AuthPopup', () => {
  let component: AuthPopup;
  let fixture: ComponentFixture<AuthPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
